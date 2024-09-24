#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <fcntl.h>
#include <sys/mman.h>
#include <string.h>
#include <unistd.h> // rox 
#include "gpio.h" // rox 

/*
导出指定编号的引脿*/
static int gpio_export(unsigned int gpio)
{
	int fd, len;
	char str_gpio[4];
	char filename[33];

	snprintf(filename, sizeof(filename), "/sys/class/gpio/gpio%d", gpio);

	/* return if gpio already exported */
	if (access(filename, F_OK) == 0) {
		debug("already exported :%s\n", filename);
		return 0;
	}

	if ((fd = open("/sys/class/gpio/export", O_WRONLY)) < 0) {

		return -1;
	}

	len = snprintf(str_gpio, sizeof(str_gpio), "%d", gpio);

	debug("echo %s > /sys/class/gpio/export\n", str_gpio);

  if(write(fd, str_gpio, len)<0) return -1;
    
	close(fd);

	return 0;
}

/*
取消导出，即取消GPIO功能，GPIO电平也能不被保持
*/
static int gpio_unexport(unsigned int gpio)
{
	int fd, len;
	char str_gpio[4];

	if ((fd = open("/sys/class/gpio/unexport", O_WRONLY)) < 0)
		return -1;

	len = snprintf(str_gpio, sizeof(str_gpio), "%d", gpio);
	if(write(fd, str_gpio, len)<0) return -1;
	close(fd);

	return 0;
}


/*
设置GPIO引脚为输出或输入
in_flag=0 => output in_flag=1 => input
*/
static int gpio_set_direction(unsigned int gpio, unsigned int in_flag)
{
	// int retry;
	// struct timespec delay;
	int fd;
	char filename[40];

	snprintf(filename, sizeof(filename), "/sys/class/gpio/gpio%d/direction", gpio);


	if ((fd = open(filename, O_WRONLY)) < 0) {
		return -1;
	}
	debug("echo %s > %s\n", in_flag?"in":"out",filename);
	if (in_flag)
  {
		if(write(fd, "in", 3)<0) return -1;
  }
	else
  {
		if(write(fd, "out", 4)<0) return -1;
  }

	close(fd);
	return 0;
}

/*
gpio_set_direction设置为GPIO输出后，可通过该函数设置GPIO电平
*/
static int gpio_set_value(unsigned int gpio,int value)
{
	int fd;
	char filename[33];

	snprintf(filename, sizeof(filename), "/sys/class/gpio/gpio%d/value", gpio);
	fd = open(filename, O_WRONLY);
	if(-1 == fd) {
		return -1;
	}

	if (value == 0) {
		if(write(fd, "0", 1)<0) return -1;
	}
	else {
		if(write(fd, "1", 1)<0) return -1;
	}
	close(fd);

	return 0;
}
/*
gpio_set_direction设置为GPIO输入后，可通过该函数获取GPIO电平状怿*/
static int gpio_get_value(unsigned int gpio)
{
	int fd;
	char filename[33];
	char ch=0;
	snprintf(filename, sizeof(filename), "/sys/class/gpio/gpio%d/value", gpio);
	fd = open(filename, O_RDONLY);
	if(-1 == fd) {
		return -1;
	}
	debug("cat %s\n", filename);
	lseek(fd, 0, SEEK_SET);
	if(read(fd, &ch, 1)<0) return 0;
	debug("value=%c\n", ch);
	close(fd);

	if(ch == '0')
		return 0;
	else
		return 1;
}

/*
获取GPIO编号的组开始位罿GPIOn_IOm  (n是组 m是组中的编号)
IMX6UL IMX6 IMX8 等GPIO n是从1开始的
AM335 GPIO n是从0开始的
为了兼容各平台，读取型号，返回n即gpio_base
*/
int get_cputype(board_info *info)
{
	FILE *fp;
	char buffer[1024];
	char hardware[1024];
	int found = 0,gpio_base = 0;

	if ((fp = fopen("/proc/cpuinfo", "r"))) {
		while(!feof(fp) && fgets(buffer, sizeof(buffer), fp)) {
			sscanf(buffer, "Hardware	: %s", hardware);
			if (strcmp(hardware, "HW6UL-CORE") == 0 ||
					strcmp(hardware, "HW335X-CORE") == 0 ||
					strcmp(hardware, "HW-IMX6-CORE") == 0 ||
					strcmp(hardware, "HW33-CORE") == 0 ||
					strcmp(hardware, "HW3288-CORE") == 0 ||
					strcmp(hardware, "HW8X-CORE") == 0
					) {
				found = 1;
			}
		}
	}
	else 
		return -1;

	fclose(fp);

	if (!found)
		return -1;

	if (strcmp(hardware, "HW6UL-CORE") == 0) {
		gpio_base = 1;
		info->num = HW6UL_CORE;
	}
	else if (strcmp(hardware, "HW335X-CORE") == 0) {
		gpio_base = 0;
		info->num = HW335X_CORE;
	}
	else if (strcmp(hardware, "HW-IMX6-CORE") == 0) {
		gpio_base = 1;
		info->num = HW_IMX6_CORE;
	}
	else if (strcmp(hardware, "HW33-CORE") == 0) {
		gpio_base = 0;
		info->num = HW33_CORE;
	}
	else if (strcmp(hardware, "HW3288-CORE") == 0) {
		gpio_base = 0;
		info->num = HW3288_CORE;
	}
	else if (strcmp(hardware, "HW8X-CORE") == 0) {
		gpio_base = 1;
		info->num = HW8X_CORE;
	}
	strcpy(info->boardName,hardware);
	return gpio_base;
}


void setup_gpio(int gpio, int direction, int pud)
{
	gpio_export(gpio);
}

int gpio_function(int gpio, unsigned int in_flag)
{
	if ((in_flag != INPUT) && (in_flag != OUTPUT))
		return -1;

	gpio_export(gpio);
	gpio_set_direction(gpio,in_flag);

	return 0;
}

void gpio_output(int gpio, int value)
{
	gpio_set_value(gpio, value);
}

int gpio_input(int gpio)
{
	int value;

	value = gpio_get_value(gpio);

	return value;
}

void cleanup(int gpio)
{
	gpio_unexport(gpio);
}


int gpioGet(const char* pinGroup, const char * pinGPIO)
{
	/* user_gpio GPIO3 24 1
     * 26 27 24 25 */
    // int gpio_group = 3;
    // int pin[4] = {26,27,24,25}; 
    
    
    // int fd = -1;
    int pin_index = 0, temp, dat, pin_base;
    board_info hardware_info;
    char varg[5] = {0};

    pin_base = get_cputype(&hardware_info);
    if (pin_base < 0)  return -1;
    
    
    /* 将输入的字符串 转化为 GPIO编号 GPIOn m =>(n-pin_base)*32 + m , 其中 n m 为整型	*/
    memcpy(varg, pinGroup, 5);
    if (memcmp("GPIO", varg, 4)) {
      printf("gpio(GPIOn m [0/1])\n");
      return -1;
    }

    if (varg[4] >= '0' && varg[4] <='9') {
          temp = varg[4] - '0';
    }
    else{
      printf("gpio(GPIOx, pin, value) Error: GPIO%d should 0 <= GPIOx <= 7 \n", varg[4]);
      return -1;
    }
    
    if (temp > 8) {
      if (hardware_info.num == HW6UL_CORE)
        printf("gpio(GPIOx, pin, value) : where n should bewteen 1 and 7 \n");
      else if (hardware_info.num == HW335X_CORE)
        printf("gpio(GPIOx, pin, value) : where n should bewteen 0 and 3 \n");
      else if (hardware_info.num == HW_IMX6_CORE)
        printf("gpio(GPIOx, pin, value) : where n should bewteen 1 and 7 \n");
      return -1;
    }
	
    pin_index = (temp - pin_base) * 0x20;
    /// atoi()函数 缺陷 不能判断 非法字符
    temp = atoi(pinGPIO);
    if (temp > 31) {
      printf("gpio(GPIOx, pin, value) : where pin should bewteen 0 and 31 \n");
      return -1;
    }

    pin_index += temp;
    /*打印出GPIO编号*/
    printf("pin_index = %d\n", pin_index);


    gpio_function(pin_index, INPUT);
    dat = gpio_input(pin_index);

    printf("Get value: 0x%x\n", dat);

    ///cleanup(pin_index);

    return 0;
}

int gpioSet(const char* pinGroup, const char * pinGPIO, int dat)
{
	/* user_gpio GPIO3 24 1
     * 26 27 24 25 */
    // int gpio_group = 3;
    // int pin[4] = {26,27,24,25}; 
    
    
    // int fd = -1;
    int pin_index = 0, temp, pin_base;
    board_info hardware_info;
    char varg[5] = {0};

    pin_base = get_cputype(&hardware_info);
    if (pin_base < 0) return -1;
    
    if (!(dat == 0 || dat == 1)) {
        printf("gpio(GPIOx, pin, 0/1)  \n");
        return -1;
    }
    
    /* 将输入的字符串 转化为 GPIO编号
      GPIOn m =>(n-pin_base)*32 + m
    其中 n m 为整型	*/
    
    memcpy(varg, pinGroup, 5);
    if (memcmp("GPIO", varg, 4)) {
      printf("gpio(GPIOn,m,[0/1])\n");
      return -1;
    }

    if (varg[4] >= '0' && varg[4] <='9') {
          temp = varg[4] - '0';
    }
    else{
      printf("gpio(GPIOx, pin, value) Error: GPIO%d should 0 <= GPIOx <= 7 \n", varg[4]);
      return -1;
    }
    
    if (temp > 8) {
      if (hardware_info.num == HW6UL_CORE)
        printf("gpio(GPIOx, pin, value) : where n should bewteen 1 and 7 \n");
      else if (hardware_info.num == HW335X_CORE)
        printf("gpio(GPIOx, pin, value) : where n should bewteen 0 and 3 \n");
      else if (hardware_info.num == HW_IMX6_CORE)
        printf("gpio(GPIOx, pin, value) : where n should bewteen 1 and 7 \n");
      return -1;
    }
      
    pin_index = (temp - pin_base) * 0x20;
    /// atoi()函数 缺陷 不能判断 非法字符
    temp = atoi(pinGPIO);
    if (temp > 31) {
      printf("gpio(GPIOx, pin, value) : where pin should bewteen 0 and 31 \n");
      return -1;
    }

    pin_index += temp;
    /*打印出GPIO编号*/
    printf("pin_index = %d\n", pin_index);

		
    gpio_function(pin_index, OUTPUT);
    gpio_output(pin_index, dat);
    
    printf("Set value = %d\n",dat);

    ///cleanup(pin_index);

    return 0;
}

