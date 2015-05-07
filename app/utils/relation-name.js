/**
 * Created by unbregg on 2015/5/4.
 */
function _getRelationNameByOptions(options) {
    var owner = options.owner,
        type = options.type,
        relationName = '';
    if (owner) {
        relationName = _getRelationName(owner, type);
    }
    return relationName;
}
function _getRelationName(record, propName) {
    var relationship = record.relationshipFor(propName),
        type = record.constructor;
    return type.determineRelationshipType(relationship);
}
/**
 * 是否是多对多关系
 * @param record
 * @param propName
 * @returns {boolean}
 */
export function isManyToMany(record, propName) {
    return _getRelationName(record, propName) === 'manyToMany';
}
/**
 * 获取关系名
 * @returns {*}
 */
export function getRelationName() {
    if (arguments > 1) {
        return _getRelationName(...arguments);
    } else {
        return _getRelationNameByOptions(...arguments);
    }
}