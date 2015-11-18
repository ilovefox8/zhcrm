Fox.define('views/admin/index', 'view', function (Dep) {

    return Dep.extend({

        template: 'admin/index',

        data: function () {
            return {
                links: this.links,
                iframeUrl: this.iframeUrl
            };
        },

        setup: function () {
            this.links = this.getMetadata().get('app.adminPanel');
            this.iframeUrl = this.getConfig().get('adminPanelIframeUrl') || '//espocrm.com/news';
        },

        updatePageTitle: function () {
            this.setPageTitle(this.getLanguage().translate('Administration'));
        },

    });
});
