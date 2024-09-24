#include <string.h>
#include <quickjs/quickjs-libc.h>
#include <quickjs/cutils.h>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include <net/if.h>
#include <sys/ioctl.h>
#include <sys/socket.h>

#include <linux/can.h>
#include <linux/can/raw.h>

#include <socketcan/lib.h>


// quote extCan & extGPIO  from /Extentsions
//extern int canSend(const char * device, const char * can_frame);
extern void mg_hexdump(const void *buf, size_t len);

int canSend(const char * device, char * can_frame)
{
    // printf("Sending CAN ... %s %s \n",device, can_frame);
    int s; /* can raw socket */ 
	int required_mtu;
	int mtu;
	int enable_canfd = 1;
	struct sockaddr_can addr;
	struct canfd_frame frame;
	struct ifreq ifr;

	/* parse CAN frame */
	required_mtu = parse_canframe(can_frame, &frame);
	if (!required_mtu)
    {
		fprintf(stderr, "\nWrong CAN-frame format! Try:\n\n");
		fprintf(stderr, "    <can_id>#{R|data}          for CAN 2.0 frames\n");
		fprintf(stderr, "    <can_id>##<flags>{data}    for CAN FD frames\n\n");
		fprintf(stderr, "<can_id> can have 3 (SFF) or 8 (EFF) hex chars\n");
		fprintf(stderr, "{data} has 0..8 (0..64 CAN FD) ASCII hex-values (optionally");
		fprintf(stderr, " separated by '.')\n");
		fprintf(stderr, "<flags> a single ASCII Hex value (0 .. F) which defines");
		fprintf(stderr, " canfd_frame.flags\n\n");
		fprintf(stderr, "e.g. 5A1#11.2233.44556677.88 / 123#DEADBEEF / 5AA# / ");
		fprintf(stderr, "123##1 / 213##311\n     1F334455#1122334455667788 / 123#R ");
		fprintf(stderr, "for remote transmission request.\n\n");
		return 1;
	}

	/* open socket */
	if ((s = socket(PF_CAN, SOCK_RAW, CAN_RAW)) < 0) {
		perror("socket");
		return 1;
	}

	strncpy(ifr.ifr_name, device, IFNAMSIZ - 1);
	ifr.ifr_name[IFNAMSIZ - 1] = '\0';
	ifr.ifr_ifindex = if_nametoindex(ifr.ifr_name);
	if (!ifr.ifr_ifindex) {
		perror("if_nametoindex");
		return 1;
	}

	addr.can_family = AF_CAN;
	addr.can_ifindex = ifr.ifr_ifindex;

	if (required_mtu > CAN_MTU) {

		/* check if the frame fits into the CAN netdevice */
		if (ioctl(s, SIOCGIFMTU, &ifr) < 0) {
			perror("SIOCGIFMTU");
			return 1;
		}
		mtu = ifr.ifr_mtu;

		if (mtu != CANFD_MTU) {
			printf("CAN interface is not CAN FD capable - sorry.\n");
			return 1;
		}

		/* interface is ok - try to switch the socket into CAN FD mode */
		if (setsockopt(s, SOL_CAN_RAW, CAN_RAW_FD_FRAMES,
			       &enable_canfd, sizeof(enable_canfd))){
			printf("error when enabling CAN FD support\n");
			return 1;
		}

		/* ensure discrete CAN FD length values 0..8, 12, 16, 20, 24, 32, 64 */
		frame.len = can_dlc2len(can_len2dlc(frame.len));
	}

	/* disable default receive filter on this RAW socket */
	/* This is obsolete as we do not read from the socket at all, but for */
	/* this reason we can remove the receive list in the Kernel to save a */
	/* little (really a very little!) CPU usage.                          */
	setsockopt(s, SOL_CAN_RAW, CAN_RAW_FILTER, NULL, 0);

	if (bind(s, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
		perror("bind");
		return 1;
	}

	/* send frame */
	if (write(s, &frame, required_mtu) != required_mtu) {
		perror("write");
		return 1;
	}

	close(s);

	return 0;
}

static JSValue js_can_send(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    // void(argc);
    const char * device = JS_ToCString(ctx, argv[0]);
    char * frame = JS_ToCString(ctx, argv[1]);
    int ret = canSend(device, frame);
  
  
    return JS_NewInt32(ctx, ret);
}



// sub functions map 子函数映射  
static const JSCFunctionListEntry js_socketcan_functions[] = 
{
    JS_CFUNC_DEF("send", 2, js_can_send),
};

// init module functions list 初始化函数列表 
static int js_socketcan_init(JSContext *ctx, JSModuleDef *module)
{
  return JS_SetModuleExportList(ctx, module, js_socketcan_functions, countof(js_socketcan_functions));
}

// init 'socketcan' module 初始化socketcan模块 
JSModuleDef *js_init_module_socketcan(JSContext *ctx, const char *module_name)
{
  JSModuleDef *module;
  module = JS_NewCModule(ctx, module_name, js_socketcan_init);
  if (!module)
  {
    return NULL;
  }
  JS_AddModuleExportList(ctx, module, js_socketcan_functions, countof(js_socketcan_functions));
  return module;
}