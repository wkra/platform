import './sw-settings-rule-list.scss';
import template from './sw-settings-rule-list.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('sw-settings-rule-list', {
    template,

    inject: [
        'repositoryFactory',
        'context'
    ],

    mixins: [
        Mixin.getByName('listing'),
        Mixin.getByName('notification')
    ],

    data() {
        return {
            rules: null,
            isLoading: false,
            sortBy: 'name'
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    computed: {
        ruleRepository() {
            return this.repositoryFactory.create('rule');
        }
    },

    methods: {
        getList() {
            this.isLoading = true;
            const criteria = new Criteria(this.page, this.limit);
            criteria.setTerm(this.term);
            const naturalSort = this.sortBy === 'createdAt';
            criteria.addSorting(Criteria.sort(this.sortBy, this.sortDirection, naturalSort));

            this.ruleRepository.search(criteria, this.context).then((items) => {
                this.total = items.total;
                this.rules = items;
                this.isLoading = false;

                return items;
            }).catch(() => {
                this.isLoading = false;
            });
        },

        onDuplicate(referenceRule) {
            this.ruleRepository.clone(referenceRule.id, this.context).then(() => {
                this.$router.push(
                    {
                        name: 'sw.settings.rule.detail',
                        params: { id: referenceRule.id }
                    }
                );
            });
        },

        onInlineEditSave(promise, rule) {
            this.isLoading = true;

            promise.then(() => {
                this.isLoading = false;

                this.createNotificationSuccess({
                    title: this.$tc('sw-settings-rule.detail.titleSaveSuccess'),
                    message: this.$tc('sw-settings-rule.detail.messageSaveSuccess', 0, { name: rule.name })
                });
            }).catch(() => {
                this.getList();
                this.createNotificationError({
                    title: this.$tc('sw-settings-rule.detail.titleSaveError'),
                    message: this.$tc('sw-settings-rule.detail.messageSaveError')
                });
            });
        },

        getRuleColumns() {
            return [{
                property: 'name',
                dataIndex: 'name',
                inlineEdit: 'string',
                label: this.$tc('sw-settings-rule.list.columnName'),
                routerLink: 'sw.settings.rule.detail',
                width: '250px',
                allowResize: true,
                primary: true
            }, {
                property: 'priority',
                label: this.$tc('sw-settings-rule.list.columnPriority'),
                inlineEdit: 'number',
                allowResize: true
            }, {
                property: 'description',
                label: this.$tc('sw-settings-rule.list.columnDescription'),
                width: '250px',
                allowResize: true
            }, {
                property: 'updatedAt',
                label: this.$tc('sw-settings-rule.list.columnDateCreated'),
                align: 'right',
                allowResize: true
            }, {
                property: 'invalid',
                label: this.$tc('sw-product-stream.list.columnStatus'),
                allowResize: true
            }];
        }
    }
});
