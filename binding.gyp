{
    "targets": [
        {
            "target_name": "WeakRef",
            "cflags": [ "-fexceptions" ],
            "cflags!": [ "!-fno-exceptions" ],
            "cflags_cc": [ "-fexceptions" ],
            "cflags_cc!": [ "!-fno-exceptions" ],
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
        }, 
        {
            "target_name": "FinalizationRegistry",
            "cflags": [ "-fexceptions" ],
            "cflags!": [ "!-fno-exceptions" ],
            "cflags_cc": [ "-fexceptions" ],
            "cflags_cc!": [ "!-fno-exceptions" ],
            "sources": [
                "FinalizationGroup.cpp"
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
        }
    ]
}
