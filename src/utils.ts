import _ from "lodash"

export function getObjChanges(oldObj, newOjb) {
  const changes = {}

  for (const key in newOjb) {
    if (!_.isEqual(newOjb[key], oldObj[key])) {
      changes[key] = newOjb[key]
    }
  }

  return changes
}

export function transformAVObjects(AVObjects) {
  return AVObjects.map(transformAVObject)
}

export function transformAVObject(AVObject) {
  const newObject = AVObject.toJSON()
  newObject.id = AVObject.id
  delete newObject.objectId
  transformPointerToPureId(newObject)
  return newObject
}

/**
 * @param {*} jsonObject AVObject.toJSON()
 */
function transformPointerToPureId(jsonObject) {
  for (const key in jsonObject) {
    if (jsonObject[key].__type === "Pointer") {
      jsonObject[key] = jsonObject[key].objectId
    }
  }
}
