{
  "targets": [{
        "target_name": "WeakRef",
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-no-fexceptions" ],
        "sources": [
            "WeakRef.cpp"
        ],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        'libraries': [],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        'conditions': [
          ['OS=="mac"', {
            'xcode_settings': {
              'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
            }
          }]
        ],
        "defines": [ 'NAPI_CPP_EXCEPTIONS' ]
    }]
}
