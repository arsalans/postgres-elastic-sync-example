/**
 * Created by arsal on 2016-12-17.
 */
export class DecoratedQueueObject {

  private m_objectId: string;
  private m_object: Object;
  private m_index: string;
  private m_requestType: string;

  constructor(objectId: string, object: Object, index: string, requestType: string) {
    this.m_objectId = objectId;
    this.m_object = object;
    this.m_index = index;
    this.m_requestType = requestType;
  }

  static fromJson(decoratedQueueString: string) {
    let object = JSON.parse(decoratedQueueString);
    return new DecoratedQueueObject(object.m_objectId, object.m_object, object.m_index, object.m_requestType);
  }

  get getObjectId(): string {
    return this.m_objectId;
  }

  set setObjectId(objectId: string) {
    if (objectId) {
      this.m_objectId = objectId;
    }
  }

  get getObject(): Object {
    return this.m_object;
  }

  set setObject(newObject: Object) {
    if (newObject) {
      this.m_object = newObject;
    }
  }

  get getIndex(): string {
    return this.m_index;
  }

  set setIndex(newIndex: string) {
    if (newIndex) {
      this.m_index = newIndex;
    }
  }

  get getRequestType(): string {
    return this.m_requestType;
  }

  set setRequestType(requestType: string) {
    if (requestType) {
      this.m_requestType = requestType;
    }
  }
}
