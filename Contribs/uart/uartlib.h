#ifndef UART_LIB_H
#define UART_LIB_H
#include <termios.h>

// 参数：串口，波特率，数据位，停止位，校验位
// 返回：文件描述符 fd， 注意最后调用close(fd);
// uart_init("/dev/ttyS1", B9600, 8, "1", 'N');
int uart_init(const char *portname, int baudrate, int databit, const char *stopbit, char parity);

// 写数据
int uart_write(int fd, const unsigned char *buf, int len);

// 读数据
int uart_read(int fd, unsigned char *buf, int len);
#endif