
Fox.define('Views.Role.Record.Edit', 'Views.Record.Edit', function (Dep) {

    return Dep.extend({

        sideView: 'Role.Record.DetailSide',

        events: _.extend({
            'change select[data-type="access"]': function (e) {
                var scope = $(e.target).attr('name');
                var $dropdowns = this.$el.find('select[data-scope="' + scope + '"]');

                if ($(e.target).val() == 'enabled') {
                    $dropdowns.removeAttr('disabled');
                } else {
                    $dropdowns.attr('disabled', 'disabled');
                }
            }
        }, Dep.prototype.events),

        fetch: function () {
            var data = Dep.prototype.fetch.call(this);

            data['data'] = {};

            var scopeList = this.getView('extra').scopeList;
            var actionList = this.getView('extra').actionList;
            var aclTypeMap = this.getView('extra').aclTypeMap;

            for (var i in scopeList) {
                var scope = scopeList[i];
                if (this.$el.find('select[name="' + scope + '"]').val() == 'not-set') {
                    continue;
                }
                if (this.$el.find('select[name="' + scope + '"]').val() == 'disabled') {
                    data['data'][scope] = false;
                } else {
                    var o = true;
                    if (aclTypeMap[scope] != 'boolean') {
                        o = {};
                        for (var j in actionList) {
                            var action = actionList[j];
                            o[action] = this.$el.find('select[name="' + scope + '-' + action + '"]').val();
                        }
                    }
                    data['data'][scope] = o;
                }
            }

            data['data'] = data['data'];
            return data;
        },

        getDetailLayout: function (callback) {
            var simpleLayout = [
                {
                    label: '',
                    cells: [
                        {
                            name: 'name',
                            type: 'varchar',
                        },
                    ]
                }
            ];
            callback({
                type: 'record',
                layout: this._convertSimplifiedLayout(simpleLayout)
            });
        },

        setup: function () {
            Dep.prototype.setup.call(this);

            this.createView('extra', 'Role.Record.Table', {
                mode: 'edit',
                aclData: this.model.get('data') || {}
            });
        },
    });
});


