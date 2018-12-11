const resolvePreset = (preset) => {
    try {
        return require.resolve(preset);
    } catch (e) {
        console.warn(`Unable to resolve preset ${preset}`);
    }
    return '';
};

module.exports = require('babel-loader').custom((babel) => {
    const babelPresetEnv = resolvePreset('@babel/preset-env');
    const babelPresetUme = resolvePreset('babel-preset-umeboshi');

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

            const { presets = [] } = cfg.options;

            [babelPresetUme, babelPresetEnv].some((preset) => {
                if (!preset) {
                    return false;
                }
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
                                ...(preset.options || {}),
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
