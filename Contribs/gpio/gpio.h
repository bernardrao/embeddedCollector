
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

// int gpio_set_direction(unsigned int gpio, unsigned int in_flag);

/* user_gpio GPIO3  24  1
 * user_gpio GPIO3 {26|27|24|25} {0|1}
 * int gpio_group = 3;
 * int pin[4] = {26,27,24,25}; 
 */
int gpioSet(const char* pinGroup, const char * pinGPIO, int dat);
