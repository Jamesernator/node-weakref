#include <node_api.h>
#include <napi.h>
#include <stdio.h>

class WeakRef : public Napi::ObjectWrap<WeakRef> {
    private:
        Napi::ObjectReference ref;
        Napi::Value deref(const Napi::CallbackInfo &info) {
            return this->ref.Value();
        };
    public:
        static Napi::Value Init(Napi::Env env) {
            Napi::Function func = DefineClass(env, "WeakRef", {
                InstanceMethod("deref", &WeakRef::deref)
            });
            return func;
        };

        WeakRef(const Napi::CallbackInfo &info) : Napi::ObjectWrap<WeakRef>(info) {
            Napi::Env env = info.Env();
            if (info.Length() != 1) {
                throw Napi::Error::New(env, "Exactly one argument must be passed to WeakRef");
            }
            Napi::Object object = Napi::Object(env, info[0]);
            if (!object.IsObject()) {
                throw Napi::Error::New(env, "Value must be an object");
            }
            ref = Napi::Weak(object);
        };
};

napi_value Init(napi_env _env, napi_value _exports) {
    Napi::Env env = Napi::Env(_env);
    Napi::Value class_ = WeakRef::Init(env);
    return (napi_value)class_;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
