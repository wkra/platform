import FilterMultiSelectPlugin from 'src/script/plugin/listing/filter-multi-select.plugin'
import Iterator from 'src/script/helper/iterator.helper';
import DomAccess from 'src/script/helper/dom-access.helper';

export default class FilterPropertySelectPlugin extends FilterMultiSelectPlugin {

    /**
     * @return {Array}
     * @public
     */
    getLabels() {
        const activeCheckboxes =
            DomAccess.querySelectorAll(this.el, `${this.options.checkboxSelector}:checked`, false);

        let labels = [];

        if (activeCheckboxes) {
            Iterator.iterate(activeCheckboxes, (checkbox) => {
                labels.push({
                    label: checkbox.dataset.label,
                    id: checkbox.id,
                    previewHex: checkbox.dataset.previewHex,
                    previewImageUrl: checkbox.dataset.previewImageUrl,
                });
            });
        } else {
            labels = [];
        }

        return labels;
    }
}
