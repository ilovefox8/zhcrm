/************************************************************************
 * This file is part of FoxCRM.
 *
 * FoxCRM - Open Source CRM application.
 * Copyright (C) 2014-2015 Yuri Kuznetsov, Taras Machyshyn, Oleksiy Avramenko
 * Website: http://www.espocrm.com
 *
 * FoxCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * FoxCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with FoxCRM. If not, see http://www.gnu.org/licenses/.
 ************************************************************************/ 
Fox.define('Views.Settings.Fields.CurrencyRates', 'Views.Fields.Base', function (Dep) {

    return Dep.extend({
    
        editTemplate: 'settings.fields.currency-rates.edit',        
        
        data: function () {
            var baseCurrency = this.model.get('baseCurrency');
            var currencyRates = this.model.get('currencyRates') || {};
            
            var rateValues = {};
            this.model.get('currencyList').forEach(function (currency) {
                if (currency != baseCurrency) {
                    rateValues[currency] = currencyRates[currency] || 1.00;
                }
            }, this);
            
            return {
                rateValues: rateValues
            };
        },
    
        setup: function () {
        },
        
        fetch: function () {
            var data = {};
            var currencyRates = {};
            
            var baseCurrency = this.model.get('baseCurrency');
            
            this.model.get('currencyList').forEach(function (currency) {
                if (currency != baseCurrency) {
                    currencyRates[currency] = parseFloat(this.$el.find('input[data-currency="'+currency+'"]').val() || 1);
                }
            }, this);
            
            data[this.name] = currencyRates;
            
            return data;
        },
        
    });
    
});
