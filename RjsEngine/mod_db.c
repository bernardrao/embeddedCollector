// #include "rjs.h"

#include <string.h>
#include <quickjs/quickjs-libc.h>
#include <quickjs/cutils.h>
#include <sqlite3/sqlite3.h>

extern const char *db_path;  // rox
extern DynBuf RJS_dbuf_new(JSContext *ctx, const char *fmt, ...);


static JSValue js_db_query(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    JSValue _sql = argv[0];
    const char* sql = JS_ToCString(ctx, _sql);
    sqlite3 *db;
	sqlite3_stmt *stmt;
    
    sqlite3_open(db_path, &db);// "data/sk.db"

	if (db == NULL)
	{
		printf("Failed to open DB\n");
		
        return JS_EXCEPTION;
	}
    
	// printf("Performing query...\n");
	sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);
	
  DynBuf res = RJS_dbuf_new(ctx, "");
  int rows =0;
	while (sqlite3_step(stmt) != SQLITE_DONE) {
		int i;
		int num_cols = sqlite3_column_count(stmt);
        if(rows==0)
        {
            for (i = 0; i < num_cols; i++)
            {
                if(i + 1 < num_cols)
                    dbuf_printf(&res, "%s,", sqlite3_column_name(stmt, i));
                else
                    dbuf_printf(&res, "%s\n", sqlite3_column_name(stmt, i));
            }
        }
		for (i = 0; i < num_cols; i++)
		{
            switch (sqlite3_column_type(stmt, i))
			{
			case (SQLITE3_TEXT):
                if(i + 1 < num_cols)
                    dbuf_printf(&res, "%s,", sqlite3_column_text(stmt, i));
                else
                    dbuf_printf(&res, "%s\n", sqlite3_column_text(stmt, i));
				break;
			case (SQLITE_INTEGER):
				if(i + 1 < num_cols)
                    dbuf_printf(&res, "%d,",  sqlite3_column_int(stmt, i));
                else
                    dbuf_printf(&res, "%d\n",  sqlite3_column_int(stmt, i));
				break;
			case (SQLITE_FLOAT):
				if(i + 1 < num_cols)
                    dbuf_printf(&res, "%g,", sqlite3_column_double(stmt, i));
                else
                    dbuf_printf(&res, "%g\n", sqlite3_column_double(stmt, i));
				break;
            case SQLITE_BLOB: 
                break;
			default:
				break;
			}
		}
        // dbuf_putc(&res, '\n');
        rows++;
	}
    dbuf_putc(&res, '\0');
	sqlite3_finalize(stmt);

	sqlite3_close(db);
  JS_FreeValue(ctx, _sql);

    // printf("\nC: query result %s\n", (char *)res.buf);
	// getc(stdin);
    
	return JS_NewString(ctx, (char *)res.buf);
}

static int js_db_exec_callback(void *NotUsed, int argc, char **argv, char **azColName) {
   int i;
   for(i = 0; i < argc; i++) {
      printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
   }
   printf("\n");
   return 0;
}

static JSValue js_db_exec(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv) {
   const char* sql = JS_ToCString(ctx, argv[0]);
   
   sqlite3 *db;
   char *zErrMsg = 0;
   int rc;
   // char *sql;

   /* Open database */
   // rc = sqlite3_open("sk.db", &db);
   rc = sqlite3_open(db_path, &db);
   
   if(rc) {
      fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
      // return JS_UNDEFINED;
      return JS_EXCEPTION;
   } else {
      fprintf(stdout, "Opened database successfully\n");
   }

   /* Create SQL statement */
   /* sql = "CREATE TABLE COMPANY("  \
      "ID INT PRIMARY KEY     NOT NULL," \
      "NAME           TEXT    NOT NULL," \
      "AGE            INT     NOT NULL," \
      "ADDRESS        CHAR(50)," \
      "SALARY         REAL );"; */

   /* Execute SQL statement */
   rc = sqlite3_exec(db, sql, js_db_exec_callback, 0, &zErrMsg);
   
   if(rc != SQLITE_OK){
      fprintf(stderr, "SQL error: %s\n", zErrMsg);
      sqlite3_free(zErrMsg);
   } else {
      fprintf(stdout, "DB exec successfully\n");
   }
   sqlite3_close(db);
   return JS_UNDEFINED;
}

// const char * help = " sqlite execute aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
static JSValue js_db_help(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    // DynBuf res = RJS_dbuf_new(ctx, "sqlite execute aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    
    
    // char * help = " sqlite execute";
    // printf("\nC: js_db_help %s\n", help);
    // printf("\nC: query result %s\n", (char *)res.buf);
	// getc(stdin);
    
	// return JS_NewString(ctx, (char *)res.buf);
  
  const char * help = " sqlite execute bbbbbbbbbbbbbbbbbbbbbbbb";
  return JS_NewString(ctx, help);
}


// 子函数映射  
static const JSCFunctionListEntry js_db_functions[] = 
{
    JS_CFUNC_DEF("exec", 1, js_db_exec),
    JS_CFUNC_DEF("query", 1, js_db_query),
    JS_CFUNC_DEF("help", 0, js_db_help),
};

// 初始化函数列表 
static int js_db_init(JSContext *ctx, JSModuleDef *module)
{
  return JS_SetModuleExportList(ctx, module, js_db_functions, countof(js_db_functions));
}




// 初始化模块 
JSModuleDef *js_init_module_db(JSContext *ctx, const char *module_name)
{
  JSModuleDef *module;
  module = JS_NewCModule(ctx, module_name, js_db_init);
  if (!module)
  {
    return NULL;
  }
  JS_AddModuleExportList(ctx, module, js_db_functions, countof(js_db_functions));
  return module;
}