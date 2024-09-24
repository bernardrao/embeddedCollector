#include "User.h"

// Parse HTTP requests, return authenticated user or NULL
struct User *getUser(struct mg_http_message *hm) 
{
    // In production, make passwords strong and tokens randomly generated
    // In this example, user list is kept in RAM. In production, it can
    // be backed by file, database, or some other method.
    static struct User users[] = {
        {"admin", "pass0", "admin_token"},
        {"user1", "pass1", "user1_token"},
        {"user2", "pass2", "user2_token"},
        {NULL, NULL, NULL},
    };
    char user[256], pass[256];
    struct User *u;
    mg_http_creds(hm, user, sizeof(user), pass, sizeof(pass));
    if (user[0] != '\0' && pass[0] != '\0') 
    {
        // Both user and password are set, search by user/password
        for (u = users; u->name != NULL; u++)
            if (strcmp(user, u->name) == 0 && strcmp(pass, u->pass) == 0) return u;
    } else if (user[0] == '\0') 
    {
        // Only password is set, search by token
        for (u = users; u->name != NULL; u++)
            if (strcmp(pass, u->token) == 0) return u;
    }
    return NULL;
}
