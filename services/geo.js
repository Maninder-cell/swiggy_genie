const db = require("../models");
const { QueryTypes } = require("sequelize");

class Geo {
  static #R = 6321;

  constructor(longitude, latitude) {
    this.longitude = longitude;
    this.latitude = latitude;
  }

  #deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  findNearDistance(location, maxDistance) {
    const lat1 = this.#deg2rad(this.latitude);
    const lon1 = this.#deg2rad(this.longitude);
    const lat2 = this.#deg2rad(location.latitude);
    const lon2 = this.#deg2rad(location.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = Geo.#R * c;

    if (distance <= maxDistance) {
      return location;
    } else {
      return false;
    }
  }

  async findNearDistanceQuery(table_name, distance) {
    const [results, metadata] = await db.sequelize.query(
      `SELECT *, (${
        Geo.#R
      } * acos(cos(radians(:latitude))*cos(radians(latitude))*cos(radians(longitude)-radians(:longitude))+sin(radians(:latitude))*sin(radians(latitude)))) AS distance FROM ${table_name} HAVING distance <= :maxDistance ORDER BY distance ASC`,
      {
        replacements: {
          latitude: this.latitude,
          longitude: this.longitude,
          maxDistance: distance,
        },
        type: QueryTypes.SELECT,
      }
    );

    return results;
  }
}

module.exports = Geo;
