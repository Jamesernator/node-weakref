#include <node_api.h>
#include <napi.h>

class WeakRef {
    public:
        WeakRef(Napi::Env env, Napi::Value value) {
            this->ref = Napi::Reference()
        };
    private:
        Napi::Reference ref;
};

napi_value Init(napi_env _env, napi_value _exports) {
    Napi::Env env = Napi::Env(_env);
    return (napi_value)makeMakeWeakRef(env);
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)