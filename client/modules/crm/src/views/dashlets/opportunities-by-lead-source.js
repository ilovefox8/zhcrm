Fox.define('Crm:Views.Dashlets.OpportunitiesByLeadSource', 'Crm:Views.Dashlets.Abstract.Chart', function (Dep) {

    return Dep.extend({

        name: 'OpportunitiesByLeadSource',    
        
        
        optionsFields: _.extend(_.clone(Dep.prototype.optionsFields), {
            'dateFrom': {
                type: 'date',
                required: true,                    
            },
            'dateTo': {
                type: 'date',
                required: true,                    
            }
        }),
        
        defaultOptions: {
            dateFrom: function () {
                return moment().format('YYYY') + '-01-01'
            },
            dateTo: function () {
                return moment().format('YYYY') + '-12-31'
            },
        },
        
        url: function () {
            return 'Opportunity/action/reportByLeadSource?dateFrom=' + this.getOption('dateFrom') + '&dateTo=' + this.getOption('dateTo');
        },
            
        prepareData: function (response) {
            var data = [];            
            for (var label in response) {
                var value = response[label];
                data.push({
                    label: this.getLanguage().translateOption(label, 'leadSource', 'Opportunity'),
                    data: [[0, value]]
                });
            }
            return data;    
        },
                
        setup: function () {
            this.currency = this.getConfig().get('defaultCurrency');
            this.currencySymbol = '';
        },    
        
        drow: function () {
            var self = this;
            this.flotr.draw(this.$container.get(0), this.chartData, {
                colors: this.colors,
                shadowSize: false,
                pie: {
                    show: true, 
                    explode: 0,
                    lineWidth: 1,
                    fillOpacity: 1,
                    sizeRatio: 0.8,
                },
                grid: {
                    horizontalLines: false,
                    verticalLines: false,
                    outline: 's'
                },
                yaxis: {
                    showLabels: false,                        
                },
                xaxis: {
                    showLabels: false,
                },
                legend: {
                    show: false,
                },
                mouse: {
                    track: true,
                    relative: true,
                    trackFormatter: function (obj) {
                        return self.formatNumber(obj.y) + ' ' + self.currency;                            
                    },
                },
                legend: {
                    show: true,
                    noColumns: 8,
                    container: this.$el.find('.legend-container'),
                    labelBoxMargin: 0
                },
            });
        },

    });
});


