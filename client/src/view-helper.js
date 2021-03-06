
Fox.define('view-helper', [], function () {

    var ViewHelper = function (options) {
        this.urlRegex = /(^|[^\[])(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        this._registerHandlebarsHelpers();

        this.mdSearch = [
            /\("?(.*?)"?\)\[(.*?)\]/g,
            /\&\#x60;(([\s\S]*?)\&\#x60;)/g,
            /(\*\*)(.*?)\1/g,
            /(\*)(.*?)\1/g,
            /\~\~(.*?)\~\~/g
        ];
        this.mdReplace = [
            '<a href="$2">$1</a>',
            '<code>$2</code>',
            '<strong>$2</strong>',
            '<em>$2</em>',
            '<del>$1</del>',
        ];
    }

    _.extend(ViewHelper.prototype, {

        layoutManager: null,

        settings: null,

        user: null,

        preferences: null,

        language: null,

        tranformTextMarkdown: function (text) {
            var newline = text.indexOf('\r\n') != -1 ? '\r\n' : text.indexOf('\n') != -1 ? '\n' : '';

            if (newline != '') {
                var d = [];
                var r = [];

                var p = text.split(newline);
                p.push('');

                var isBlockLevel = false;
                p.forEach(function (item, i) {
                    if (item.length >= 5 && item.indexOf('&gt; ') === 0) {
                        if (!isBlockLevel) {
                            d = [];
                            isBlockLevel = true;
                        }
                        d.push(item.replace(/&gt; /gm, ''));

                    } else {
                        if (isBlockLevel) {
                            r.push('<blockquote>' + d.join(newline) + '</blockquote>' + item)
                        } else {
                            r.push(item);
                        }
                        isBlockLevel = false;
                    }
                }, this);

                if (r.slice(-1)[0] == '') {
                    r.pop();
                }

                var t = r.join(newline);

                return t;
            }

            return text;
        },

        _registerHandlebarsHelpers: function () {
            var self = this;

            Handlebars.registerHelper('img', function (img) {
                return new Handlebars.SafeString("<img src=\"img/" + img + "\"></img>");
            });

            Handlebars.registerHelper('prop', function (object, name) {
                if (name in object) {
                    return object[name];
                }
            });

            Handlebars.registerHelper('var', function (name, context, options) {
                return new Handlebars.SafeString(context[name]);
            });

            Handlebars.registerHelper('concat', function (left, right) {
                return left + right;
            });

            Handlebars.registerHelper('ifEqual', function (left, right, options) {
                if (left == right) {
                    return options.fn(this);
                }
                return options.inverse(this);
            });

            Handlebars.registerHelper('ifNotEqual', function (left, right, options) {
                if (left != right) {
                    return options.fn(this);
                }
                return options.inverse(this);
            });

            Handlebars.registerHelper('ifPropEquals', function (object, property, value, options) {
                if (object[property] == value) {
                    return options.fn(this);
                }
                return options.inverse(this);
            });

            Handlebars.registerHelper('ifAttrEquals', function (model, attr, value, options) {
                if (model.get(attr) == value) {
                    return options.fn(this);
                }
                return options.inverse(this);
            });

            Handlebars.registerHelper('ifAttrNotEmpty', function (model, attr, options) {
                var value = model.get(attr);
                if (value !== null && typeof value !== 'undefined') {
                    return options.fn(this);
                }
                return options.inverse(this);
            });

            Handlebars.registerHelper('get', function (model, name) {
                return model.get(name);
            });

            Handlebars.registerHelper('length', function (arr) {
                return arr.length;
            });

            Handlebars.registerHelper('translate', function (name, options) {
                var scope = options.hash.scope || null;
                var category = options.hash.category || null;
                if (name === 'null') {
                    return '';
                }
                return self.language.translate(name, category, scope);
            });

            Handlebars.registerHelper('button', function (name, options) {
                var style = options.hash.style || 'default';
                var scope = options.hash.scope || null;
                var label = options.hash.label || name;
                return new Handlebars.SafeString('<button class="btn btn-'+style+' action'+ (options.hash.hidden ? ' hidden' : '')+'" data-action="'+name+'" type="button">'+self.language.translate(label, 'labels', scope)+'</button>');
            });

            Handlebars.registerHelper('hyphen', function (string) {
                return Fox.Utils.convert(string, 'c-h');
            });

            Handlebars.registerHelper('toDom', function (string) {
                return Fox.Utils.toDom(string);
            });

            Handlebars.registerHelper('breaklines', function (text) {
                text = Handlebars.Utils.escapeExpression(text || '');
                text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
                return new Handlebars.SafeString(text);
            });

            Handlebars.registerHelper('complexText', function (text) {
                text = Handlebars.Utils.escapeExpression(text || '');

                text = text.replace(self.urlRegex, '$1($2)[$2]');

                self.mdSearch.forEach(function (re, i) {
                    text = text.replace(re, self.mdReplace[i]);
                });

                text = self.tranformTextMarkdown(text);

                text = text.replace(/(\r\n|\n|\r)/gm, '<br>');

                text = text.replace('[#see-more-text]', ' <a href="javascript:" data-action="seeMoreText">' + self.language.translate('See more')) + '</a>';
                return new Handlebars.SafeString(text);
            });

            Handlebars.registerHelper('translateOption', function (name, options) {
                var scope = options.hash.scope || null;
                var field = options.hash.field || null;
                if (!field) {
                    return '';
                }
                var translationHash = options.hash.translatedOptions || null;
                if (translationHash === null) {
                    translationHash = self.language.translate(field, 'options', scope) || {};
                    if (typeof translationHash !== 'object') {
                        translationHash = {};
                    }
                }
                return translationHash[name] || name;
            });

            Handlebars.registerHelper('options', function (list, value, options) {
                value = value || false;
                list = list || {};
                var html = '';
                var isArray = (Object.prototype.toString.call(list) === '[object Array]');

                var multiple = (Object.prototype.toString.call(value) === '[object Array]');
                var checkOption = function (name) {
                    if (multiple) {
                        return value.indexOf(name) != -1;
                    } else {
                        return value === name;
                    }
                };

                options.hash = options.hash || {};

                var scope = options.hash.scope || false;
                var category = options.hash.category || false;
                var field = options.hash.field || false;

                var translationHash = options.hash.translationHash || options.hash.translatedOptions || null;

                if (translationHash === null) {
                    if (!category && field) {
                        translationHash = self.language.translate(field, 'options', scope) || {};
                        if (typeof translationHash !== 'object') {
                            translationHash = {};
                        }
                    } else {
                        translationHash = {};
                    }
                }
                var translate = function (name) {
                    if (!category) {
                        return translationHash[name] || name;
                    }
                    return self.language.translate(name, category, scope);
                };

                for (var key in list) {
                    var keyVal = list[key];
                    html += "<option value=\"" + keyVal + "\" " + (checkOption(list[key]) ? 'selected' : '') + ">" + translate(list[key]) + "</option>"
                }
                return new Handlebars.SafeString(html);
            });
        }
    });

    return ViewHelper;

});
