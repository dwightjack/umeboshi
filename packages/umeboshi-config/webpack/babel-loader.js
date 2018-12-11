module.exports = require('babel-loader').custom((babel) => {
    const babelPresetEnv = require.resolve('@babel/preset-env');
    const babelPresetUme = require.resolve('babel-preset-umeboshi');

    return {
        customOptions({ modern, ...loader }) {
            return {
                custom: { modern },
                loader
            };
        },

        config(cfg, { customOptions }) {
            if (!customOptions.modern) {
                return cfg.options;
            }

            let idx = -1;
            let resolved;

            const { presets } = cfg.options;

            [babelPresetUme, babelPresetEnv].some((preset) => {
                resolved = preset;
                idx = presets.findIndex(
                    (item) => item.file.resolved === preset
                );
                return idx !== -1;
            });

            if (idx !== -1 && resolved) {
                const preset = presets[idx];

                presets.splice(
                    idx,
                    1,
                    babel.createConfigItem(
                        [
                            resolved,
                            {
                                ...preset.options,
                                targets: {
                                    esmodules: true
                                }
                            }
                        ],
                        { type: 'preset' }
                    )
                );
            }

            return {
                ...cfg.options
            };
        }
    };
});
