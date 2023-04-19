 exports.createProperties = async (req, res) => {
  //const t = await sequelize.transaction();

  try {

    const { name, property_type, description, tenancy_status, city, state, street, postal_code, country, latitude,
      longitude, furnishing_status,amenities, area, rooms, questions, images } = req.body;

    const insertLog = {
      body: JSON.stringify(req.body),
      user_id: req.userData.id
    };
    await TableLogModel.create(insertLog);

    const insertData = {
      user_id: req.userData.id,
      name,
      property_type: parseInt(property_type), //0 -> Entire Palace 1 -> Private Room 2 -> Shared Room 3 -> Others
      description,
      tenancy_status: parseInt(tenancy_status),   // 0 -> Vacant 1 -> Applicant 2 -->Tenanted
      street,
      city,
      state,
      postal_code,
      country,
      latitude: parseFloat(latitude ? latitude : 0),
      longitude: parseFloat(longitude ? longitude : 0),
      furnishing_status: parseInt(furnishing_status),    //  0 -> Unfurnished 1 -> Partially Furnished 2 -> Fully Furnished
     
      area,
    };
    //console.log(insertData);
    //create properties
    const createProperty = await PropertiesModel.create(insertData);
    const property_id = createProperty.id;
    //save properties images
    //console.log(images);
    const images_array = [];
    for (const image of images) {

      images_array.push({
        property_id: property_id,
        image_id: image.image_id,


      });
    }
    await PropertyImageModel.bulkCreate(images_array, { individualHooks: true });
    //save propeties rooms
    const rooms_array = [];
    for (const room of rooms) {
      const getImages = await ImageModel.findOne({ where: { id: room.image_id } });
      rooms_array.push({
        property_id: property_id,
        name: room.name,
        image_id: room.image_id,
        room_type: room.type,
        url: getImages.image,
        caption: getImages.caption
      });
    }
    await PropertiesRoomsModel.bulkCreate(rooms_array, { individualHooks: true });
    //save property question and proprty queton options
    //fetch title ,type,has_other on behalf of question id on Question table and save in tbl_property_questions
    //fetch preferred from tbl_question coorect answer 
    //TBL_PROPERTY_QUESTIONS
    //TBL_PROPERTY_OPTIONS

    for (const question of questions) {

      const getQuestionDetails = await QuestionModel.findOne({ where: { id: question.question_id } });
      const propertyQuestion = {
        property_id: property_id,
        question_id: question.question_id,
        option_id: question.option_id ? question.option_id : 0,
        title: getQuestionDetails.title,
        type: getQuestionDetails.type,
        has_other: getQuestionDetails.has_other ? getQuestionDetails.has_other : 0,

      };
      const createPropertyQuestion = await PropertyQuestionModel.create(propertyQuestion);
      //for MCQ
      if (question.type == 1) {
        console.log(question.question_id);
        const getOptions = await QuestionOptionsModel.findAll({ where: { question_id: question.question_id } });
        console.log(getOptions);
        //return res.json(getOptions);

        for (const question_option of getOptions) {
          const insertOption = {
            property_id: createPropertyQuestion.property_id,
            property_question_id: createPropertyQuestion.id,
            text: question_option.text,
            preferred: question_option.preferred,
            option_id: question_option.id

          };
          await PropertyOptionModel.create(insertOption);
        }


      }

    }
    //save amenities
    const amenities_array = [];
    for (const amenitiy of amenities) {
      amenities_array.push({
        property_id: property_id,
        amenity_id: amenitiy,


      });

    }


    await PropertyAmenitiesModel.bulkCreate(amenities_array, { individualHooks: true });


    const getProperty = await PropertiesModel.findOne({
      where: { id: property_id },
      include: [
        {
          model: ImageModel,
          as: 'property_images',
          attributes: ['id', 'image', 'caption', 'user_id']

        },
        {
          model: AmenitiesModel,
          as: 'property_amenities',
          attributes: ['id', 'name', 'icon']
        },
        {
          model: PropertiesRoomsModel,
          as: 'property_rooms',
          attributes: ['id', 'name', 'url', 'room_type', 'caption']
        }


      ],
    });
    //await transaction.commit();

    return apiResponse.SuccessResponseWithData(res, res.__('PROPERTY_CREATED_SUCESSFULLY'), getProperty);

  }
  catch (e) {
    //await t.rollback();

    console.log(e);
    return apiResponse.InternalServerError(res, e);
  }
};