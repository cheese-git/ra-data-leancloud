import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  UPDATE,
  CREATE,
  DELETE,
  DELETE_MANY
} from "react-admin"
import {
  transformAVObject,
  transformAVObjects,
  getObjChanges,
  transformObjectIdToPointer,
  buildAVObjectsFromIds
} from "./utils"
import _ from "lodash"
import config from "./config"

async function dataProvider(type, resource, params) {
  const { debug, AV } = config

  debug && console.log(type, resource, params)

  const query = new AV.Query(resource)
  let data = []

  switch (type) {
    case GET_LIST:
      return await handleGetList(resource, params)

    case GET_ONE:
      data = await query.get(params.id).then(transformAVObject)

      return { data }

    case GET_MANY: {
      const AVObjects = buildAVObjectsFromIds(resource, params.ids)
      const data = await AV.Object.fetchAll(AVObjects).then(transformAVObjects)
      return { data }
    }

    case UPDATE:
      const changes = getObjChanges(params.previousData, params.data)
      const AVObject = AV.Object.createWithoutData(resource, params.id)
      await AVObject.save(changes)
      data = await AVObject.fetch().then(transformAVObject)
      return { data }

    case CREATE: {
      const dataToSave = transformObjectIdToPointer(params.data)
      const AVObject = new AV.Object(resource)
      const dataSaved = await AVObject.save(dataToSave, {
        fetchWhenSave: true
      }).then(transformAVObject)

      return { data: dataSaved }
    }

    case DELETE: {
      const AVObject: AV.Object = AV.Object.createWithoutData(
        resource,
        params.id
      )
      const data = await AVObject.destroy().then(transformAVObject)
      return { data }
    }

    case DELETE_MANY: {
      const AVObjects = buildAVObjectsFromIds(resource, params.ids)
      await AV.Object.destroyAll(AVObjects)
      return { data: params.ids }
    }
    default:
      throw new Error(`Unsupported fetch action type ${type}`)
  }
}

async function handleGetList(
  resource,
  { sort, pagination: { page, perPage }, filter }
) {
  const query = new config.AV.Query(resource)

  handleFilter(query, filter)
  if (sort.order === "DESC") {
    query.descending(sort.field)
  } else {
    query.ascending(sort.field)
  }

  query.limit(perPage)
  query.skip((page - 1) * perPage)

  const data = await query.find().then(transformAVObjects)
  const total = await query.count()
  return {
    data,
    total
  }
}

function handleFilter(query, filter) {
  for (const key in filter) {
    if (key.indexOf(".") > 0) {
      handleInnerQuery(query, key, filter[key])
    } else {
      query.equalTo(key, filter[key])
    }
  }
}

function handleInnerQuery(query, key, value) {
  const { AV } = config
  const keys = key.split(".")
  let innerQuery, outerQuery, innerClassName

  innerClassName = _.upperFirst(keys[keys.length - 2])
  innerQuery = new AV.Query(innerClassName)
  innerQuery.equalTo(keys[keys.length - 1], value)

  for (let i = keys.length - 3; i >= 0; i--) {
    const outerClassName = _.upperFirst(keys[i])
    outerQuery = new AV.Query(outerClassName)
    outerQuery.matchesQuery(keys[i + 1], innerQuery)
    innerQuery = outerQuery
  }

  query.matchesQuery(keys[0], innerQuery)
}

dataProvider.init = options => {
  config.init(options)
}

export default dataProvider
