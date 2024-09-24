#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <fcntl.h>
#include <sys/mman.h>
#include <string.h>
#include <unistd.h> // rox 


#ifdef DEBUG
#define debug(fmt,args...)  printf(fmt,##args);
#else
#define debug(fmt,args...)
#endif

#define INPUT  1
#define OUTPUT 0 
#define ALT0   4

#define HIGH 1
#define LOW  0

#define PUD_OFF  0
#define PUD_DOWN 1
#define PUD_UP   2

enum board_num {
	HW6UL_CORE = 1,
	HW335X_CORE = 2,
	HW_IMX6_CORE = 3,
	HW33_CORE = 4,
	HW3288_CORE = 5,
	HW8X_CORE = 6
};

typedef struct
{
	char processor[30];
	enum board_num num;
	char boardName[30];
	int revision;
	int ram;
	int rom;
} board_info;

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
	write(fd, str_gpio, len);
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
	write(fd, str_gpio, len);
	close(fd);

	return 0;
}


/*
设置GPIO引脚为输出或输入
in_flag=0 => output in_flag=1 => input
*/
static int gpio_set_direction(unsigned int gpio, unsigned int in_flag)
{
	int retry;
	struct timespec delay;
	int fd;
	char filename[40];

	snprintf(filename, sizeof(filename), "/sys/class/gpio/gpio%d/direction", gpio);


	if ((fd = open(filename, O_WRONLY)) < 0) {
		return -1;
	}
	debug("echo %s > %s\n", in_flag?"in":"out",filename);
	if (in_flag)
		write(fd, "in", 3);
	else
		write(fd, "out", 4);

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
		write(fd, "0", 1);
	}
	else {
		write(fd, "1", 1);
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
	read(fd, &ch, 1);
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


// int user_gpio_main(int argc, char *argv[])
int main(int argc, char *argv[])
{
	/* user_gpio GPIO3 24 1
     * 26 27 24 25 */
    // int gpio_group = 3;
    // int pin[4] = {26,27,24,25}; 
    
    
    int fd = -1;
	int pin_index = 0, temp, dat, pin_base;
	board_info hardware_info;
	char varg[5] = {0};

	pin_base = get_cputype(&hardware_info);
	if (pin_base < 0) {
		return -1;
	}
    
    
	/* 将输入的字符串 转化为 GPIO编号
    GPIOn m =>(n-pin_base)*32 + m
	其中 n m 为整型	*/
	if ((argc != 3) && (argc != 4)) {
		if (hardware_info.num == HW6UL_CORE || hardware_info.num == HW_IMX6_CORE)
        {
			printf("usage:\n  %s GPIOn pin value\n", argv[0]);
            printf("\nparameter:\n");
            printf("  n      :1-7    \t which group of pins\n");
            printf("  pin    :0-31   \t which pin \n");
            printf("  value  :0 or 1 \t the value you want to set \n");
			printf("\nexample: set GPIO group 3 pin 24 to 0 \n");
			printf("  %s GPIO3 24 0 \n\n", argv[0]);
        }
		else if (hardware_info.num == HW335X_CORE)
        {
			printf(" usage:\n\t %s GPIOn pin value\n", argv[0]);
            printf("\nparameter:\n");
            printf("  n      :0-3    \t which group of pins\n");
            printf("  pin    :0-31   \t which pin \n");
            printf("  value  :0 or 1 \t the value you want to set \n");
			printf("\nexample: set GPIO group 3 pin 24 to 0 \n");
			printf("  %s GPIO3 24 0 \n\n", argv[0]);
        }
		else
			printf("No Definition Platform\n");

		return -1;
	}

	memcpy(varg, argv[1], 5);
	if (memcmp("GPIO", varg, 4)) {
		printf("%s GPIOn m [0/1]\n", argv[0]);
		return -1;
	}

	if (varg[4] >= '0' && varg[4] <='9') {
			temp = varg[4] - '0';
	}
	else{
		printf("%s GPIO%s 0 <= n <= 7 \n", argv[0], argv[4]);
		return -1;
	}

	
	if (temp > 8) {
		if (hardware_info.num == HW6UL_CORE)
			printf("%s GPIOn pin value : where n should bewteen 1 and 7 \n", argv[0]);
		else if (hardware_info.num == HW335X_CORE)
			printf("%s GPIOn pin value : where n should bewteen 0 and 3 \n", argv[0]);
		else if (hardware_info.num == HW_IMX6_CORE)
			printf("%s GPIOn pin value : where n should bewteen 1 and 7 \n", argv[0]);
		return -1;
	}
	
	pin_index = (temp - pin_base) * 0x20;
	/// atoi()函数 缺陷 不能判断 非法字符
	temp = atoi(argv[2]);
	if (temp > 31) {
		printf("%s GPIOn pin value : where pin should bewteen 0 and 31 \n", argv[0]);
		return -1;
	}

	pin_index += temp;
	/*打印出GPIO编号*/
	printf("pin_index = %d\n",pin_index);

	if (argc == 4) {
		dat = atoi(argv[3]);
		if (!(dat == 0 || dat == 1)) {
			printf("%s GPIOn m 0/1 \n", argv[0]);
			return -1;
		}
	}
	/*4个参数时为GPIO输出＿个参数时为GPIO输入*/
	if (argc == 4) {
		gpio_function(pin_index, OUTPUT);
		gpio_output(pin_index, dat);
		
		printf("Set value = %d\n",dat);
	}
	else {
		gpio_function(pin_index, INPUT);
		dat = gpio_input(pin_index);

		printf("Get value: 0x%x\n", dat);
	}

	///cleanup(pin_index);

	return 0;
}

