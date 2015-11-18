
Fox.define('Views.Role.Record.Table', 'View', function (Dep) {

    return Dep.extend({

        template: 'role.table',

        scopeList: null,

        actionList: ['read', 'edit', 'delete'],

        accessList: ['not-set', 'enabled', 'disabled'],

        colors: {
            all: '#6BC924',
            team: '#999900',
            own: '#CC9900',
            no: '#F23333',

            enabled: '#6BC924',
            disabled: '#F23333',
            'not-set': '#A8A8A8',
        },

        mode: 'detail',

        aclData: null,

        levelListMap: {
            'recordAllTeamOwnNo': ['all', 'team', 'own', 'no'],
            'recordAllTeamNo': ['all', 'team', 'no'],
            'recordAllOwnNo': ['all', 'own', 'no'],
            'recordAllNo': ['all', 'no'],
            'record': ['all', 'team', 'own', 'no'],
        },

        data: function () {
            var data = {};
            data['editMode'] = this.mode === 'edit';
            data['actionList'] = this.actionList;
            data['accessList'] = this.accessList;
            data['colors'] = this.colors;
            data['aclTable'] = this.getAclTable();
            return data;
        },

        getAclTable: function () {
            var aclData = this.aclData;
            var aclTable = {};
            for (var i in this.scopeList) {
                var controller = this.scopeList[i];
                var o = {};

                var access = 'not-set';

                if (this.final) {
                    access = 'enabled';
                }

                if (controller in aclData) {
                    if (aclData[controller] === false) {
                        access = 'disabled';
                    } else {
                        access = 'enabled';
                    }
                }
                if (this.aclTypeMap[controller] != 'boolean') {
                    for (var j in this.actionList) {
                        var action = this.actionList[j];
                        var level = 'all';
                        if (controller in aclData) {
                            if (access == 'enabled') {
                                if (aclData[controller] !== true) {
                                    if (action in aclData[controller]) {
                                        level = aclData[controller][action];
                                    }
                                }
                            } else {
                                level = 'no';
                            }
                        }
                        o[action] = {level: level, name: controller + '-' + action};
                    }
                }
                var type = this.aclTypeMap[controller];
                aclTable[controller] = {
                    acl: o,
                    access: access,
                    name: controller,
                    type: type,
                    levelList: this.levelListMap[type] || []
                };
            }
            return aclTable;
        },

        getAclList: function (type) {

        },

        setup: function () {
            this.mode = this.options.mode || 'detail';
            this.aclData = this.options.aclData;
            this.final = this.options.final || false;

            this.aclTypeMap = {};

            this.scopeList = [];

            var scopesAll = Object.keys(this.getMetadata().get('scopes')).sort(function (v1, v2) {
                 return this.translate(v1, 'scopeNamesPlural').localeCompare(this.translate(v2, 'scopeNamesPlural'));
            }.bind(this));

            scopesAll.forEach(function (scope) {
                var acl = this.getMetadata().get('scopes.' + scope + '.acl');
                if (acl) {
                    this.scopeList.push(scope);
                    this.aclTypeMap[scope] = acl;
                    if (acl === true) {
                        this.aclTypeMap[scope] = 'recordAllTeamOwnNo';
                    }
                }
            }.bind(this));
        },
    });
});


