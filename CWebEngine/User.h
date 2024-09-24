// Authenticated user.
// A user can be authenticated by:
//   - a name:pass pair
//   - a token
// When a user is shown a login screen, they enter a user:pass. If successful,
// the server returns the user info, which includes the token. From that point
// on, the client can use the token for authentication. Tokens could be
// refreshed/changed at server side, forcing clients to re-login.

#ifndef CORE_USER_H
#define CORE_USER_H
#ifdef __cplusplus
extern "C" {
#endif




#include <mongoose/mongoose.h>

struct User {
  const char *name, *pass, *token;
};

struct User *getUser(struct mg_http_message *hm);




#ifdef __cplusplus
}
#endif
#endif  // CORE_USER_H