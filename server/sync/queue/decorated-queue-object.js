"use strict";
/**
 * Created by arsal on 2016-12-17.
 */
class DecoratedQueueObject {
    constructor(objectId, object, index, requestType) {
        this.m_objectId = objectId;
        this.m_object = object;
        this.m_index = index;
        this.m_requestType = requestType;
    }
    static fromJson(decoratedQueueString) {
        let object = JSON.parse(decoratedQueueString);
        return new DecoratedQueueObject(object.m_objectId, object.m_object, object.m_index, object.m_requestType);
    }
    get getObjectId() {
        return this.m_objectId;
    }
    set setObjectId(objectId) {
        if (objectId) {
            this.m_objectId = objectId;
        }
    }
    get getObject() {
        return this.m_object;
    }
    set setObject(newObject) {
        if (newObject) {
            this.m_object = newObject;
        }
    }
    get getIndex() {
        return this.m_index;
    }
    set setIndex(newIndex) {
        if (newIndex) {
            this.m_index = newIndex;
        }
    }
    get getRequestType() {
        return this.m_requestType;
    }
    set setRequestType(requestType) {
        if (requestType) {
            this.m_requestType = requestType;
        }
    }
}
exports.DecoratedQueueObject = DecoratedQueueObject;
//# sourceMappingURL=decorated-queue-object.js.map