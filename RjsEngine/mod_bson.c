#include <string.h>
#include <quickjs/quickjs-libc.h>
#include <quickjs/cutils.h>
#include <stdio.h>
#include <unistd.h>

#include <libbson/src/bson/bson.h>

static JSValue js_bson_toJson(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
   
   // bson_init_from_json('{"a":1}');
   
   bson_t *b;
  bson_error_t error;
	const char * json = JS_ToCString(ctx, argv[0]);
	
	
  b = bson_new_from_json ((const uint8_t *) json, -1, &error);

  if (!b) {
     printf ("Error: %s\n", error.message);
  } else {
     bson_destroy (b);
  }
  
  
   // bson_reader_t *reader;
   // const bson_t *b;
   // bson_error_t error;
   // // const char *filename;
   // char *str;
   // int i;

   // /*
    // * Print program usage if no arguments are provided.
    // */
   // if (argc == 1) {
      // fprintf (stderr, "usage: %s [FILE | -]...\nUse - for STDIN.\n", argv[0]);
      // return 1;
   // }

   // /*
    // * Process command line arguments expecting each to be a filename.
    // */
   // for (i = 1; i < argc; i++) {
      // filename = argv[i];

      // if (strcmp (filename, "-") == 0) {
         // reader = bson_reader_new_from_fd (STDIN_FILENO, false);
      // } else {
         // if (!(reader = bson_reader_new_from_file (filename, &error))) {
            // fprintf (
               // stderr, "Failed to open \"%s\": %s\n", filename, error.message);
            // continue;
         // }
      // }

      // /*
       // * Convert each incoming document to JSON and print to stdout.
       // */
      // while ((b = bson_reader_read (reader, NULL))) {
         // str = bson_as_canonical_extended_json (b, NULL);
         // fprintf (stdout, "%s\n", str);
         // bson_free (str);
      // }

      // /*
       // * Cleanup after our reader, which closes the file descriptor.
       // */
      // bson_reader_destroy (reader);
   // }

   return JS_NULL;
}


typedef struct JSString {
    JSRefCountHeader header; /* must come first, 32-bit */
    uint32_t len : 31;
    uint8_t is_wide_char : 1; /* 0 = 8 bits, 1 = 16 bits characters */
    /* for JS_ATOM_TYPE_SYMBOL: hash = 0, atom_type = 3,
       for JS_ATOM_TYPE_PRIVATE: hash = 1, atom_type = 3
       XXX: could change encoding to have one more bit in hash */
    uint32_t hash : 30;
    uint8_t atom_type : 2; /* != 0 if atom, JS_ATOM_TYPE_x */
    uint32_t hash_next; /* atom_index for JS_ATOM_TYPE_SYMBOL */
#ifdef DUMP_LEAKS
    struct list_head link; /* string list */
#endif
    union {
        uint8_t str8[0]; /* 8 bit strings will get an extra null terminator */
        uint16_t str16[0];
    } u;
} JSString;
typedef struct StringBuffer {
    JSContext *ctx;
    JSString *str;
    int len;
    int size;
    int is_wide_char;
    int error_status;
} StringBuffer;
typedef struct JSONStringifyContext {
    JSValueConst replacer_func;
    JSValue stack;
    JSValue property_list;
    JSValue gap;
    JSValue empty;
    StringBuffer *b;
} JSONStringifyContext;

static int js_json_to_bson(JSContext *ctx, JSONStringifyContext *jsc,   // rox 这个是最核心的 bson 转换 
                          JSValueConst holder, JSValue val,
                          JSValueConst indent)
{
    JSValue indent1, sep, sep1, tab, v, prop;
    JSObject *p;
    int64_t i, len;
    int cl, ret;
    BOOL has_content;
    
    indent1 = JS_UNDEFINED;
    sep = JS_UNDEFINED;
    sep1 = JS_UNDEFINED;
    tab = JS_UNDEFINED;
    prop = JS_UNDEFINED;

    switch (JS_VALUE_GET_NORM_TAG(val)) {
    case JS_TAG_OBJECT:
        p = JS_VALUE_GET_OBJ(val);
        cl = p->class_id;
        if (cl == JS_CLASS_STRING) {
            val = JS_ToStringFree(ctx, val);
            if (JS_IsException(val))
                goto exception;
            val = JS_ToQuotedStringFree(ctx, val);
            if (JS_IsException(val))
                goto exception;
            return string_buffer_concat_value_free(jsc->b, val);
        } else if (cl == JS_CLASS_NUMBER) {
            val = JS_ToNumberFree(ctx, val);
            if (JS_IsException(val))
                goto exception;
            return string_buffer_concat_value_free(jsc->b, val);
        } else if (cl == JS_CLASS_BOOLEAN) {
            ret = string_buffer_concat_value(jsc->b, p->u.object_data);
            JS_FreeValue(ctx, val);
            return ret;
        } else
#ifdef CONFIG_BIGNUM
        if (cl == JS_CLASS_BIG_FLOAT) {
            return string_buffer_concat_value_free(jsc->b, val);
        } else
#endif
        if (cl == JS_CLASS_BIG_INT) {
            JS_ThrowTypeError(ctx, "bigint are forbidden in JSON.stringify");
            goto exception;
        }
        v = js_array_includes(ctx, jsc->stack, 1, (JSValueConst *)&val);
        if (JS_IsException(v))
            goto exception;
        if (JS_ToBoolFree(ctx, v)) {
            JS_ThrowTypeError(ctx, "circular reference");
            goto exception;
        }
        indent1 = JS_ConcatString(ctx, JS_DupValue(ctx, indent), JS_DupValue(ctx, jsc->gap));
        if (JS_IsException(indent1))
            goto exception;
        if (!JS_IsEmptyString(jsc->gap)) {
            sep = JS_ConcatString3(ctx, "\n", JS_DupValue(ctx, indent1), "");
            if (JS_IsException(sep))
                goto exception;
            sep1 = JS_NewString(ctx, " ");
            if (JS_IsException(sep1))
                goto exception;
        } else {
            sep = JS_DupValue(ctx, jsc->empty);
            sep1 = JS_DupValue(ctx, jsc->empty);
        }
        v = js_array_push(ctx, jsc->stack, 1, (JSValueConst *)&val, 0);
        if (check_exception_free(ctx, v))
            goto exception;
        ret = JS_IsArray(ctx, val);
        if (ret < 0)
            goto exception;
        if (ret) {
            if (js_get_length64(ctx, &len, val))
                goto exception;
            string_buffer_putc8(jsc->b, '[');
            for(i = 0; i < len; i++) {
                if (i > 0)
                    string_buffer_putc8(jsc->b, ',');
                string_buffer_concat_value(jsc->b, sep);
                v = JS_GetPropertyInt64(ctx, val, i);
                if (JS_IsException(v))
                    goto exception;
                /* XXX: could do this string conversion only when needed */
                prop = JS_ToStringFree(ctx, JS_NewInt64(ctx, i));
                if (JS_IsException(prop))
                    goto exception;
                v = js_json_check(ctx, jsc, val, v, prop);
                JS_FreeValue(ctx, prop);
                prop = JS_UNDEFINED;
                if (JS_IsException(v))
                    goto exception;
                if (JS_IsUndefined(v))
                    v = JS_NULL;
                if (js_json_to_bson(ctx, jsc, val, v, indent1))
                    goto exception;
            }
            if (len > 0 && !JS_IsEmptyString(jsc->gap)) {
                string_buffer_putc8(jsc->b, '\n');
                string_buffer_concat_value(jsc->b, indent);
            }
            string_buffer_putc8(jsc->b, ']');
        } else {
            if (!JS_IsUndefined(jsc->property_list))
                tab = JS_DupValue(ctx, jsc->property_list);
            else
                tab = js_object_keys(ctx, JS_UNDEFINED, 1, (JSValueConst *)&val, JS_ITERATOR_KIND_KEY);
            if (JS_IsException(tab))
                goto exception;
            if (js_get_length64(ctx, &len, tab))
                goto exception;
            string_buffer_putc8(jsc->b, '{');
            has_content = FALSE;
            for(i = 0; i < len; i++) {
                JS_FreeValue(ctx, prop);
                prop = JS_GetPropertyInt64(ctx, tab, i);
                if (JS_IsException(prop))
                    goto exception;
                v = JS_GetPropertyValue(ctx, val, JS_DupValue(ctx, prop));
                if (JS_IsException(v))
                    goto exception;
                v = js_json_check(ctx, jsc, val, v, prop);
                if (JS_IsException(v))
                    goto exception;
                if (!JS_IsUndefined(v)) {
                    if (has_content)
                        string_buffer_putc8(jsc->b, ',');
                    prop = JS_ToQuotedStringFree(ctx, prop);
                    if (JS_IsException(prop)) {
                        JS_FreeValue(ctx, v);
                        goto exception;
                    }
                    string_buffer_concat_value(jsc->b, sep);
                    string_buffer_concat_value(jsc->b, prop);
                    string_buffer_putc8(jsc->b, ':');
                    string_buffer_concat_value(jsc->b, sep1);
                    if (js_json_to_bson(ctx, jsc, val, v, indent1))
                        goto exception;
                    has_content = TRUE;
                }
            }
            if (has_content && JS_VALUE_GET_STRING(jsc->gap)->len != 0) {
                string_buffer_putc8(jsc->b, '\n');
                string_buffer_concat_value(jsc->b, indent);
            }
            string_buffer_putc8(jsc->b, '}');
        }
        if (check_exception_free(ctx, js_array_pop(ctx, jsc->stack, 0, NULL, 0)))
            goto exception;
        JS_FreeValue(ctx, val);
        JS_FreeValue(ctx, tab);
        JS_FreeValue(ctx, sep);
        JS_FreeValue(ctx, sep1);
        JS_FreeValue(ctx, indent1);
        JS_FreeValue(ctx, prop);
        return 0;
    case JS_TAG_STRING:
        val = JS_ToQuotedStringFree(ctx, val);
        if (JS_IsException(val))
            goto exception;
        goto concat_value;
    case JS_TAG_FLOAT64:
        if (!isfinite(JS_VALUE_GET_FLOAT64(val))) {
            val = JS_NULL;
        }
        goto concat_value;
    case JS_TAG_INT:
#ifdef CONFIG_BIGNUM
    case JS_TAG_BIG_FLOAT:
#endif
    case JS_TAG_BOOL:
    case JS_TAG_NULL:
    concat_value:
        return string_buffer_concat_value_free(jsc->b, val);
    case JS_TAG_BIG_INT:
        JS_ThrowTypeError(ctx, "bigint are forbidden in JSON.stringify");
        goto exception;
    default:
        JS_FreeValue(ctx, val);
        return 0;
    }
    
exception:
    JS_FreeValue(ctx, val);
    JS_FreeValue(ctx, tab);
    JS_FreeValue(ctx, sep);
    JS_FreeValue(ctx, sep1);
    JS_FreeValue(ctx, indent1);
    JS_FreeValue(ctx, prop);
    return -1;
}

static JSValue js_bson_fromJson(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
// int fromJSON (int argc, char *argv[])
{
   
   // FILE *file;
   // long json_length =0 ;
   bson_t *bson;
   bson_error_t error;
   // const char * json ="{\"a\":[1,2,3]}";
	
   size_t plen =0;
   const char * json = JS_ToCString(ctx, argv[0]);
   // const char * json = JS_ToBsonChar(ctx, &plen, argv[0]);
   for (size_t i = 0; i < plen; i++)
   {
	   // printf ("a[%ld](0x%02x)\t",i, data1[i]);
	   printf ("%02x ",json[i]);
   }
   printf ("\njson %s len %ld \n",json,plen);
   
   
   // bson = bson_new_from_json ((const uint8_t *) json, -1, &error);
   
   // bson = bson_new_from_json ((uint8_t *) "{\"binary\": { \"$binary\": { \"subType\": \"00\", "
                                          // "\"base64\": \"\" } } }", -1, &error);
   // ASSERT_OR_PRINT (bson, error);
   // _check_null_binary (bson, is_legacy);
   // bson_destroy (bson);
   
   
   
   // bson = bson_new_from_json ((const uint8_t *) argv[0], -1, &error);
   
   
   // printf ("bson length[%ld]\n",bson->len);
   
   // if (!data) {
      // fprintf (stderr, "Cannot parse %s: %s\n", filename, error.message);
      // abort ();
   // }
   
   
   // bson_reader_t *reader;
   // bool eof;
   // reader = bson_reader_new_from_data (buffer, sizeof buffer);
   // b = bson_reader_read (reader, &eof);
   // bson_reader_destroy (reader);
   
   // const uint8_t *data1 = bson_get_data(bson);
   // for (size_t i = 0; i < bson->len; i++)
   // {
	   // // printf ("a[%ld](0x%02x)\t",i, data1[i]);
	   // printf ("%02x ",data1[i]);
   // }
   // printf ("\n");
   
   
   // char * j = bson_as_canonical_extended_json (bson, NULL);
   // printf ("j: %s\n", j);

   // bson_free ((void *) json);
   // bson_destroy (bson);
   return JS_NULL;
   
   
   // bson_json_reader_t *reader;
   // bson_error_t error;
   // const char *filename;
   // bson_t doc = BSON_INITIALIZER;
   // int i;
   // int b;

   // /*
    // * Print program usage if no arguments are provided.
    // */
   // if (argc == 1) {
      // fprintf (stderr, "usage: %s FILE...\n", argv[0]);
      // return 1;
   // }

   // /*
    // * Process command line arguments expecting each to be a filename.
    // */
   // for (i = 1; i < argc; i++) {
      // filename = argv[i];

      // /*
       // * Open the filename provided in command line arguments.
       // */
      // if (0 == strcmp (filename, "-")) {
         // reader = bson_json_reader_new_from_fd (STDIN_FILENO, false);
      // } else {
         // if (!(reader = bson_json_reader_new_from_file (filename, &error))) {
            // fprintf (
               // stderr, "Failed to open \"%s\": %s\n", filename, error.message);
            // continue;
         // }
      // }

      // /*
       // * Convert each incoming document to BSON and print to stdout.
       // */
      // while ((b = bson_json_reader_read (reader, &doc, &error))) {
         // if (b < 0) {
            // fprintf (stderr, "Error in json parsing:\n%s\n", error.message);
            // abort ();
         // }

         // if (fwrite (bson_get_data (&doc), 1, doc.len, stdout) != doc.len) {
            // fprintf (stderr, "Failed to write to stdout, exiting.\n");
            // exit (1);
         // }
         // bson_reinit (&doc);
      // }

      // bson_json_reader_destroy (reader);
      // bson_destroy (&doc);
   // }

   // return 0;
}

static JSValue js_bson_read(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    uint8_t *buf;
    uint64_t pos, len;
    JSValue obj;
    size_t size;
    int flags;

    if (JS_ToIndex(ctx, &pos, argv[1]))
        return JS_EXCEPTION;
    if (JS_ToIndex(ctx, &len, argv[2]))
        return JS_EXCEPTION;
	
    buf = JS_GetArrayBuffer(ctx, &size, argv[0]);
    if (!buf)
        return JS_EXCEPTION;
    if (pos + len > size)
        return JS_ThrowRangeError(ctx, "array buffer overflow");
    flags = 0;
    if (JS_ToBool(ctx, argv[3]))
        flags |= JS_READ_OBJ_REFERENCE;
	
    obj = JS_ReadObject(ctx, buf + pos, len, flags);
    return obj;
}

static JSValue js_bson_write(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    size_t len;
    uint8_t *buf;
    JSValue array;
    int flags;

    flags = 0;
    if (JS_ToBool(ctx, argv[1]))
        flags |= JS_WRITE_OBJ_REFERENCE;
    buf = JS_WriteObject(ctx, &len, argv[0], flags);
    if (!buf)
        return JS_EXCEPTION;
    array = JS_NewArrayBufferCopy(ctx, buf, len);
    js_free(ctx, buf);
    return array;
}

static const JSCFunctionListEntry js_bson_funcs[] = {
    JS_CFUNC_DEF("fromJson", 2, js_bson_fromJson ),
    // JS_CFUNC_DEF("toJson", 2, js_bson_toJson ),
	
    JS_CFUNC_DEF("read", 4, js_bson_read ),
    JS_CFUNC_DEF("write", 2, js_bson_write ),
};

static int js_bson_init(JSContext *ctx, JSModuleDef *m)
{
    return JS_SetModuleExportList(ctx, m, js_bson_funcs,
                                  countof(js_bson_funcs));
}

// #ifdef JS_SHARED_LIBRARY
// #define JS_INIT_MODULE js_init_module
// #else
// #define JS_INIT_MODULE js_init_module_bson
// #endif

// JSModuleDef *JS_INIT_MODULE(JSContext *ctx, const char *module_name)
JSModuleDef *js_init_module_bson(JSContext *ctx, const char *module_name)
{
    JSModuleDef *m;
    m = JS_NewCModule(ctx, module_name, js_bson_init);
    if (!m)
        return NULL;
    JS_AddModuleExportList(ctx, m, js_bson_funcs, countof(js_bson_funcs));
    return m;
}