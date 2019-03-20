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

export function transformObjectIdToPointer(data: object): object {
  const keys = Object.keys(data)
  keys.forEach(key => {
    const value = data[key]
    if (isObjectId(value)) {
      const className = _.upperFirst(key)
      data[key] = {
        __type: "Pointer",
        className,
        objectId: value
      }
    }
  })

  return data
}

/** private functions **/

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

function isObjectId(value): boolean {
  if (typeof value !== "string") {
    return false
  }
  if (/[a-z,0-9]{24}/.test(value)) {
    return true
  } else {
    return false
  }
}
