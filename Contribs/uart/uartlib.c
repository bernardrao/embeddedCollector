#include "uartlib.h"
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdint.h>
#include <string.h>
#include "mongoose/mongoose.h"

// 设置串口参数
// 设置波特率
static void set_baudrate(struct termios *opt, unsigned int baudrate)
{
    cfsetispeed(opt, baudrate);
    cfsetospeed(opt, baudrate);
}
// 设置停止位
static void set_stopbit(struct termios *opt, const char *stopbit)
{
    if (0 == strcmp(stopbit, "1"))
    {
        opt->c_cflag &= ~CSTOPB;
    }
    else if (0 == strcmp(stopbit, "1.5"))
    {
        opt->c_cflag &= ~CSTOPB;
    }
    else if (0 == strcmp(stopbit, "2"))
    {
        opt->c_cflag |= CSTOPB;
    }
    else
    {
        opt->c_cflag &= ~CSTOPB;
    }
}

// 设置数据位
static void set_data_bit(struct termios *opt, unsigned int databit)
{
    opt->c_cflag &= ~CSIZE;
    switch (databit)
    {
    case 8:
        opt->c_cflag |= CS8;
        break;
    case 7:
        opt->c_cflag |= CS7;
        break;
    case 6:
        opt->c_cflag |= CS6;
        break;
    case 5:
        opt->c_cflag |= CS5;
        break;
    default:
        opt->c_cflag |= CS8;
        break;
    }
}
// 设置校验位
static void set_parity(struct termios *opt, char parity)
{
    switch (parity)
    {
    case 'N':
    case 'n':
        opt->c_cflag &= ~PARENB;
        break;
    case 'E':
    case 'e':
        opt->c_cflag |= PARENB;
        opt->c_cflag &= ~PARODD;
        break;
    case 'O':
    case 'o':
        opt->c_cflag |= PARENB;
        opt->c_cflag |= ~PARODD;
        break;
    case 'S':
    case 's':
        opt->c_cflag &= ~PARENB;
        opt->c_cflag &= ~CSTOPB;
        opt->c_iflag |= INPCK;
        break;
    default:
        opt->c_cflag &= ~PARENB;
        break;
    }
}

static int set_port_attr(int fd, int baudrate, int databit, const char *stopbit, char parity)
{
    struct termios opt;
    tcgetattr(fd, &opt);
    set_baudrate(&opt, baudrate);
    set_data_bit(&opt, databit);
    set_parity(&opt, parity);
    set_stopbit(&opt, stopbit);

    opt.c_cflag &= ~CRTSCTS;                                // 不使用硬件流控制
    opt.c_cflag |= CLOCAL | CREAD;                          // 本地连线，使能接收标志
    opt.c_iflag &= ~(IXON | IXOFF | IXANY | INLCR | ICRNL); // 关闭字符映射(INLCR | ICRNL), 关闭流控字符(IXON)
    opt.c_oflag &= ~OPOST;
    opt.c_lflag &= ~(ICANON | ECHO | ECHOE | ISIG);
    tcflush(fd, TCIFLUSH);
    return (tcsetattr(fd, TCSANOW, &opt));
}

int uart_init(const char *portname, int baudrate, int databit, const char *stopbit, char parity)
{
    int fd = open(portname, O_RDWR | O_CREAT, S_IRUSR | S_IWUSR);
    MG_INFO(("uart_init fd %d ", fd));

#if MG_ARCH != MG_ARCH_WIN32
    fcntl(fd, F_SETFL, fcntl(fd, F_GETFL) | O_NONBLOCK);
#endif
    if (set_port_attr(fd, baudrate, databit, stopbit, parity) < 0)
    {
        MG_ERROR(("set_port_attr fail"));
    }
    // char *msg = "test\n";
    // uart_write(fd, msg, strlen(msg));
    return fd;
}

int uart_write(int fd, const unsigned char *buf, int len)
{
    return write(fd, buf, len);
    // FILE *fp = fdopen(fd, "w+");
    // fwrite(buf, 1, len, fp);
    // fflush(fp);
    // fclose(fp);
}

int uart_read(int fd, unsigned char *buf, int len)
{
    return read(fd, buf, len);
}