import DS from 'ember-data';
import Ember from 'ember';
import BaseBuildUrl from './base-build-url';

var BuildURLMixin = DS.BuildURLMixin,
    get = Ember.get;
export default Ember.Mixin.create(BuildURLMixin, BaseBuildUrl, {
    buildURL(type, id, snapshot, requestType, operation) {
        switch (requestType) {
            case 'find':
                return this.urlForFind(id, type, snapshot);
            case 'findAll':
                return this.urlForFindAll(type);
            case 'findQuery':
                return this.urlForFindQuery(id, type);
            case 'findMany':
                return this.urlForFindMany(id, type, snapshot);
            case 'findHasMany':
                return this.urlForFindHasMany(id, type);
            case 'findBelongsTo':
                return this.urlForFindBelongsTo(id, type);
            case 'createRecord':
                return this.urlForCreateRecord(type, snapshot);
            case 'deleteRecord':
                return this.urlForDeleteRecord(id, type, snapshot);
            case 'resourceOperation':
                return this.urlForResourceOperation(type, operation);
            case 'recordOperation':
                return this.urlForRecordOperation(id, type, snapshot, operation);
            case 'findManyToMany' :
            {
                return this.urlForManyToMany(id, type, snapshot);
            }
            case 'findOneToMany' :
            {
                return this.urlForOneToMany(id, type, snapshot);
            }
            case 'xFind' :
            {
                    return this.urlForXFind(id, type, snapshot);
            }
            case 'commit':
            {
                return this.urlForCommit(id, type, snapshot);
            }

            default:
                return this._buildURL(type, id);
        }
    },
    xBuildURL : function(id, type, options){
        var urlSuffix = get(options, 'urlSuffix'),
            url = this._buildURL(type, id);
        if (urlSuffix) {
            url = url + '/' + urlSuffix;
        }
        //build url
        return url;
    },
    urlForXFind : function(id, type, options){
        return this.xBuildURL(id, type, options);
    },
    urlForOneToMany : function(id, type, options){
        var owner = get(options,'owner'),
            typeName = get(options,'type'),
            urlSuffix = get(options, 'urlSuffix') || '',
            url = this._buildURL(owner.constructor.typeKey, get(owner,'id'));
        typeName = get(owner, typeName + '.type.typeKey');
        url = url + '/' + typeName.pluralize();
        if (urlSuffix) {
            url = url + '/' + urlSuffix;
        }
        return url;
    },
    urlForManyToMany: function (id, type, options) {
        var owner = get(options, 'owner'),
            typeName = get(options, 'type'),
            host = get(this, 'host'),
            urlSuffix = get(options, 'urlSuffix') || '',
            relation = this.store.modelFor('relation'),
            masterName = relation.getMasterBetween(owner, typeName),
            url = masterName + 'Relations/';

        if (host && url.charAt(0) === '/' && url.charAt(1) !== '/') {
            url = host + url;
        }
        return url + urlSuffix;
    },
    urlFormOneToMany: function (id, type, options) {

    },
    urlForCommit: function (id, type, options) {
        return this.xBuildURL(id, type, options);
    },
    /**
     *
     * @param type
     * @param operation
     * @returns {string}
     */
    urlForResourceOperation: function (type, operation) {
        return this._buildURL(type) + '/' + operation;
    },
    /**
     *
     * @param id
     * @param type
     * @param snapshot
     * @param operation
     * @returns {string}
     */
    urlForRecordOperation: function (id, type, snapshot, operation) {
        return this._buildURL(type, id) + '/' + operation;
    },
    buildURLByRelationship: function (store, record, url) {
        var isManyToMany = store.isManyToMany(record, url),
            relation = store.modelFor('relation'),
            masterName = relation.getMasterBetween(record, url);
        if (isManyToMany) {
            url = masterName + 'Relations/';
        }
        return url;
    },
    headers: Ember.computed('serializerType', function () {
        return {
            'X-Serializer-Type': this.get('serializerType')
        };
    })
});
