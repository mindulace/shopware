import { MtTextEditor as MtTextEditorOriginal } from '@shopware-ag/meteor-component-library';
import type {
    CustomButton,
} from "@shopware-ag/meteor-component-library/dist/esm/components/form/mt-text-editor/_internal/mt-text-editor-toolbar";
import type {PropType} from "vue";
import template from './mt-text-editor.html.twig';
import './mt-text-editor.scss';

// Use the compatConfig from the Shopware object and disable all compatibilities
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
MtTextEditorOriginal.compatConfig = Object.fromEntries(
    Object.keys(Shopware.compatConfig).map((key) => [
        key,
        false,
    ]),
);

/**
 * @package admin
 *
 * @private
 * @status ready
 * @description Wrapper component for mt-text-editor. Replaces the link
 * button with a custom implementation specific to the Shopware admin.
 */
Shopware.Component.register('mt-text-editor', {
    template,

    compatConfig: Shopware.compatConfig,

    components: {
        'mt-text-editor-original': MtTextEditorOriginal,
    },

    props: {
        /**
         * @deprecated tag:v6.7.0 - The value prop is deprecated and will be replaced by modelValue
         */
        value: {
            type: String,
            required: false,
            default: null,
        },

        modelValue: {
            type: String,
            required: false,
            default: '',
        },

        /**
         * Custom buttons to be added to the toolbar
         */
        customButtons: {
            type: Array as PropType<CustomButton[]>,
            default: () => [],
        },

        /**
         * Excluded buttons from the toolbar
         */
        excludedButtons: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
    },

    emits: ['update:modelValue', 'update:value'],

    computed: {
        listeners() {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            if (this.isCompatEnabled('INSTANCE_LISTENERS')) {
                return this.$listeners;
            }

            return {};
        },

        compatValue: {
            get() {
                if (this.value === null || this.value === undefined) {
                    return this.modelValue;
                }

                return this.value;
            },
            set(value: string) {
                this.$emit('update:value', value);
                this.$emit('update:modelValue', value);
            },
        },

        mergedCustomButtons() {
            const editorButtons: CustomButton[] = [];

            return [...editorButtons, ...this.customButtons];
        },

        mergedExcludedButtons() {
            const excludedEditorButtons: string[] = [];

            return [...excludedEditorButtons, ...this.excludedButtons];
        },
    },

    methods: {
        getSlots() {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            if (this.isCompatEnabled('INSTANCE_SCOPED_SLOTS')) {
                return {
                    ...this.$slots,
                    ...this.$scopedSlots,
                };
            }

            return this.$slots;
        },

        onUpdateModelValue(value: string) {
            this.$emit('update:modelValue', value);
        },
    },

});
