CREATE TABLE [Cinema] (
    [cinemaId] varchar(100) NOT NULL,
    [cinemaName] nvarchar(100) NOT NULL,
    [cinemaLocation] nvarchar(200) NOT NULL,
    [cinemaDescription] nvarchar(max) NOT NULL,
    [cinemaContactHotlineNumber] varchar(10) NOT NULL,
    [isDeleted] bit NOT NULL,
    CONSTRAINT [PK_Cinema] PRIMARY KEY ([cinemaId])
);
GO


CREATE TABLE [foodInformation] (
    [foodInformationId] nvarchar(450) NOT NULL,
    [foodInformationName] nvarchar(30) NOT NULL,
    [foodImageURL] nvarchar(255) NOT NULL,
    [foodPrice] bigint NOT NULL,
    CONSTRAINT [PK_foodInformation] PRIMARY KEY ([foodInformationId])
);
GO


CREATE TABLE [HourSchedule] (
    [HourScheduleID] varchar(50) NOT NULL,
    [HourScheduleShowTime] varchar(10) NOT NULL,
    CONSTRAINT [PK_HourSchedule] PRIMARY KEY ([HourScheduleID])
);
GO


CREATE TABLE [Language] (
    [languageId] varchar(100) NOT NULL,
    [languageDetail] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_Language] PRIMARY KEY ([languageId])
);
GO


CREATE TABLE [minimumAges] (
    [minimumAgeID] nvarchar(450) NOT NULL,
    [minimumAgeInfo] nvarchar(450) NOT NULL,
    [minimumAgeDescription] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_minimumAges] PRIMARY KEY ([minimumAgeID])
);
GO


CREATE TABLE [movieGenre] (
    [movieGenreId] varchar(100) NOT NULL,
    [movieGenreName] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_movieGenre] PRIMARY KEY ([movieGenreId])
);
GO


CREATE TABLE [movieVisualFormat] (
    [movieVisualFormatId] varchar(100) NOT NULL,
    [movieVisualFormatName] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_movieVisualFormat] PRIMARY KEY ([movieVisualFormatId])
);
GO


CREATE TABLE [priceInformation] (
    [priceInformationId] varchar(100) NOT NULL,
    [priceAmount] bigint NOT NULL,
    CONSTRAINT [PK_priceInformation] PRIMARY KEY ([priceInformationId])
);
GO


CREATE TABLE [roleInformation] (
    [roleId] varchar(100) NOT NULL,
    [roleName] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_roleInformation] PRIMARY KEY ([roleId])
);
GO


CREATE TABLE [userInformation] (
    [userId] varchar(100) NOT NULL,
    [loginUserEmail] varchar(100) NOT NULL,
    [loginUserPassword] varchar(100) NOT NULL,
    CONSTRAINT [PK_userInformation] PRIMARY KEY ([userId])
);
GO


CREATE TABLE [userType] (
    [userTypeId] varchar(100) NOT NULL,
    [userTypeDescription] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_userType] PRIMARY KEY ([userTypeId])
);
GO


CREATE TABLE [movieInformation] (
    [movieId] varchar(100) NOT NULL,
    [minimumAgeID] nvarchar(450) NOT NULL,
    [movieName] nvarchar(100) NOT NULL,
    [movieImage] nvarchar(450) NOT NULL,
    [movieDescription] nvarchar(max) NOT NULL,
    [movieDirector] nvarchar(200) NOT NULL,
    [movieActor] nvarchar(300) NOT NULL,
    [movieTrailerUrl] varchar(300) NOT NULL,
    [movieDuration] int NOT NULL,
    [ReleaseDate] datetime2 NOT NULL,
    [isDelete] bit NOT NULL,
    [languageId] varchar(100) NOT NULL,
    CONSTRAINT [PK_movieInformation] PRIMARY KEY ([movieId]),
    CONSTRAINT [FK_movieInformation_Language_languageId] FOREIGN KEY ([languageId]) REFERENCES [Language] ([languageId]) ON DELETE CASCADE,
    CONSTRAINT [FK_movieInformation_minimumAges_minimumAgeID] FOREIGN KEY ([minimumAgeID]) REFERENCES [minimumAges] ([minimumAgeID]) ON DELETE CASCADE
);
GO


CREATE TABLE [cinemaRoom] (
    [cinemaRoomId] varchar(100) NOT NULL,
    [cinemaRoomNumber] int NOT NULL,
    [cinemaId] varchar(100) NOT NULL,
    [movieVisualFormatID] varchar(100) NOT NULL,
    [isDeleted] bit NOT NULL,
    CONSTRAINT [PK_cinemaRoom] PRIMARY KEY ([cinemaRoomId]),
    CONSTRAINT [FK_cinemaRoom_Cinema_cinemaId] FOREIGN KEY ([cinemaId]) REFERENCES [Cinema] ([cinemaId]) ON DELETE CASCADE,
    CONSTRAINT [FK_cinemaRoom_movieVisualFormat_movieVisualFormatID] FOREIGN KEY ([movieVisualFormatID]) REFERENCES [movieVisualFormat] ([movieVisualFormatId]) ON DELETE CASCADE
);
GO


CREATE TABLE [Customers] (
    [Id] varchar(100) NOT NULL,
    [userID] varchar(100) NOT NULL,
    [IdentityCode] varchar(200) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [dateOfBirth] datetime2 NOT NULL,
    [phoneNumber] varchar(10) NOT NULL,
    CONSTRAINT [PK_Customers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Customers_userInformation_userID] FOREIGN KEY ([userID]) REFERENCES [userInformation] ([userId]) ON DELETE CASCADE
);
GO


CREATE TABLE [EmailList] (
    [EmailId] nvarchar(450) NOT NULL,
    [UserId] varchar(100) NOT NULL,
    [EmailCode] nvarchar(max) NOT NULL,
    [isUsed] bit NOT NULL,
    [ResetToken] nvarchar(max) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [ExpirationDate] datetime2 NOT NULL,
    CONSTRAINT [PK_EmailList] PRIMARY KEY ([EmailId]),
    CONSTRAINT [FK_EmailList_userInformation_UserId] FOREIGN KEY ([UserId]) REFERENCES [userInformation] ([userId]) ON DELETE CASCADE
);
GO


CREATE TABLE [Staff] (
    [Id] varchar(100) NOT NULL,
    [cinemaID] varchar(100) NOT NULL,
    [userID] varchar(100) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [dateOfBirth] datetime2 NOT NULL,
    [phoneNumber] varchar(10) NOT NULL,
    CONSTRAINT [PK_Staff] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Staff_Cinema_cinemaID] FOREIGN KEY ([cinemaID]) REFERENCES [Cinema] ([cinemaId]) ON DELETE CASCADE,
    CONSTRAINT [FK_Staff_userInformation_userID] FOREIGN KEY ([userID]) REFERENCES [userInformation] ([userId]) ON DELETE CASCADE
);
GO


CREATE TABLE [userRoleInformation] (
    [userId] varchar(100) NOT NULL,
    [roleId] varchar(100) NOT NULL,
    CONSTRAINT [PK_userRoleInformation] PRIMARY KEY ([roleId], [userId]),
    CONSTRAINT [FK_userRoleInformation_roleInformation_roleId] FOREIGN KEY ([roleId]) REFERENCES [roleInformation] ([roleId]) ON DELETE CASCADE,
    CONSTRAINT [FK_userRoleInformation_userInformation_userId] FOREIGN KEY ([userId]) REFERENCES [userInformation] ([userId]) ON DELETE CASCADE
);
GO


CREATE TABLE [priceInformationForEachUserFilmType] (
    [userTypeId] varchar(100) NOT NULL,
    [movieVisualFormatId] varchar(100) NOT NULL,
    [priceInformationID] varchar(100) NOT NULL,
    CONSTRAINT [PK_priceInformationForEachUserFilmType] PRIMARY KEY ([userTypeId], [movieVisualFormatId], [priceInformationID]),
    CONSTRAINT [FK_priceInformationForEachUserFilmType_movieVisualFormat_movieVisualFormatId] FOREIGN KEY ([movieVisualFormatId]) REFERENCES [movieVisualFormat] ([movieVisualFormatId]) ON DELETE CASCADE,
    CONSTRAINT [FK_priceInformationForEachUserFilmType_priceInformation_priceInformationID] FOREIGN KEY ([priceInformationID]) REFERENCES [priceInformation] ([priceInformationId]) ON DELETE CASCADE,
    CONSTRAINT [FK_priceInformationForEachUserFilmType_userType_userTypeId] FOREIGN KEY ([userTypeId]) REFERENCES [userType] ([userTypeId]) ON DELETE CASCADE
);
GO


CREATE TABLE [movieGenreInformation] (
    [movieId] varchar(100) NOT NULL,
    [movieGenreId] varchar(100) NOT NULL,
    CONSTRAINT [PK_movieGenreInformation] PRIMARY KEY ([movieId], [movieGenreId]),
    CONSTRAINT [FK_movieGenreInformation_movieGenre_movieGenreId] FOREIGN KEY ([movieGenreId]) REFERENCES [movieGenre] ([movieGenreId]) ON DELETE CASCADE,
    CONSTRAINT [FK_movieGenreInformation_movieInformation_movieId] FOREIGN KEY ([movieId]) REFERENCES [movieInformation] ([movieId]) ON DELETE CASCADE
);
GO


CREATE TABLE [movieVisualFormatDetails] (
    [movieId] varchar(100) NOT NULL,
    [movieVisualFormatId] varchar(100) NOT NULL,
    CONSTRAINT [PK_movieVisualFormatDetails] PRIMARY KEY ([movieId], [movieVisualFormatId]),
    CONSTRAINT [FK_movieVisualFormatDetails_movieInformation_movieId] FOREIGN KEY ([movieId]) REFERENCES [movieInformation] ([movieId]) ON DELETE CASCADE,
    CONSTRAINT [FK_movieVisualFormatDetails_movieVisualFormat_movieVisualFormatId] FOREIGN KEY ([movieVisualFormatId]) REFERENCES [movieVisualFormat] ([movieVisualFormatId]) ON DELETE CASCADE
);
GO


CREATE TABLE [movieSchedule] (
    [movieScheduleId] varchar(100) NOT NULL,
    [cinemaRoomId] varchar(100) NOT NULL,
    [movieId] varchar(100) NOT NULL,
    [movieVisualFormatID] varchar(100) NOT NULL,
    [DayInWeekendSchedule] nvarchar(50) NOT NULL,
    [HourScheduleID] varchar(50) NOT NULL,
    [ScheduleDate] datetime2 NOT NULL,
    [IsDelete] bit NOT NULL,
    CONSTRAINT [PK_movieSchedule] PRIMARY KEY ([movieScheduleId]),
    CONSTRAINT [FK_movieSchedule_HourSchedule_HourScheduleID] FOREIGN KEY ([HourScheduleID]) REFERENCES [HourSchedule] ([HourScheduleID]) ON DELETE CASCADE,
    CONSTRAINT [FK_movieSchedule_cinemaRoom_cinemaRoomId] FOREIGN KEY ([cinemaRoomId]) REFERENCES [cinemaRoom] ([cinemaRoomId]) ON DELETE CASCADE,
    CONSTRAINT [FK_movieSchedule_movieInformation_movieId] FOREIGN KEY ([movieId]) REFERENCES [movieInformation] ([movieId]) ON DELETE CASCADE,
    CONSTRAINT [FK_movieSchedule_movieVisualFormat_movieVisualFormatID] FOREIGN KEY ([movieVisualFormatID]) REFERENCES [movieVisualFormat] ([movieVisualFormatId]) ON DELETE CASCADE
);
GO


CREATE TABLE [Seats] (
    [seatsId] varchar(100) NOT NULL,
    [seatsNumber] varchar(10) NOT NULL,
    [isTaken] bit NOT NULL,
    [isDelete] bit NOT NULL,
    [cinemaRoomId] varchar(100) NOT NULL,
    CONSTRAINT [PK_Seats] PRIMARY KEY ([seatsId]),
    CONSTRAINT [FK_Seats_cinemaRoom_cinemaRoomId] FOREIGN KEY ([cinemaRoomId]) REFERENCES [cinemaRoom] ([cinemaRoomId]) ON DELETE CASCADE
);
GO


CREATE TABLE [movieCommentDetail] (
    [commentID] nvarchar(450) NOT NULL,
    [movieId] varchar(100) NOT NULL,
    [customerID] varchar(100) NOT NULL,
    [userCommentDetail] nvarchar(200) NOT NULL,
    [createdCommentTime] datetime2 NOT NULL,
    CONSTRAINT [PK_movieCommentDetail] PRIMARY KEY ([commentID]),
    CONSTRAINT [FK_movieCommentDetail_Customers_customerID] FOREIGN KEY ([customerID]) REFERENCES [Customers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_movieCommentDetail_movieInformation_movieId] FOREIGN KEY ([movieId]) REFERENCES [movieInformation] ([movieId]) ON DELETE CASCADE
);
GO


CREATE TABLE [Order] (
    [orderId] varchar(100) NOT NULL,
    [paymentMethod] varchar(50) NOT NULL,
    [PaymentStatus] nvarchar(max) NOT NULL,
    [totalAmount] bigint NOT NULL,
    [message] nvarchar(max) NOT NULL,
    [paymentRequestCreatedDate] datetime2 NOT NULL,
    [customerID] varchar(100) NOT NULL,
    CONSTRAINT [PK_Order] PRIMARY KEY ([orderId]),
    CONSTRAINT [FK_Order_Customers_customerID] FOREIGN KEY ([customerID]) REFERENCES [Customers] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [StaffOrder] (
    [orderId] varchar(100) NOT NULL,
    [paymentMethod] varchar(50) NOT NULL,
    [PaymentStatus] nvarchar(50) NOT NULL,
    [totalAmount] bigint NOT NULL,
    [message] nvarchar(200) NOT NULL,
    [paymentRequestCreatedDate] datetime2 NOT NULL,
    [StaffID] varchar(100) NOT NULL,
    [CustomerName] nvarchar(40) NULL,
    CONSTRAINT [PK_StaffOrder] PRIMARY KEY ([orderId]),
    CONSTRAINT [FK_StaffOrder_Staff_StaffID] FOREIGN KEY ([StaffID]) REFERENCES [Staff] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [FoodOrderDetail] (
    [orderId] varchar(100) NOT NULL,
    [foodInformationId] nvarchar(450) NOT NULL,
    [quanlity] int NOT NULL,
    [PriceEach] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_FoodOrderDetail] PRIMARY KEY ([orderId], [foodInformationId]),
    CONSTRAINT [FK_FoodOrderDetail_Order_orderId] FOREIGN KEY ([orderId]) REFERENCES [Order] ([orderId]) ON DELETE CASCADE,
    CONSTRAINT [FK_FoodOrderDetail_foodInformation_foodInformationId] FOREIGN KEY ([foodInformationId]) REFERENCES [foodInformation] ([foodInformationId]) ON DELETE CASCADE
);
GO


CREATE TABLE [TicketOrderDetail] (
    [orderId] varchar(100) NOT NULL,
    [movieScheduleID] varchar(100) NOT NULL,
    [seatsId] varchar(100) NOT NULL,
    [PriceEach] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_TicketOrderDetail] PRIMARY KEY ([seatsId], [movieScheduleID], [orderId]),
    CONSTRAINT [FK_TicketOrderDetail_Order_orderId] FOREIGN KEY ([orderId]) REFERENCES [Order] ([orderId]) ON DELETE CASCADE,
    CONSTRAINT [FK_TicketOrderDetail_Seats_seatsId] FOREIGN KEY ([seatsId]) REFERENCES [Seats] ([seatsId]) ON DELETE CASCADE,
    CONSTRAINT [FK_TicketOrderDetail_movieSchedule_movieScheduleID] FOREIGN KEY ([movieScheduleID]) REFERENCES [movieSchedule] ([movieScheduleId]) ON DELETE CASCADE
);
GO


CREATE TABLE [StaffOrderDetailFoods] (
    [orderId] varchar(100) NOT NULL,
    [foodInformationId] nvarchar(450) NOT NULL,
    [foodEachPrice] decimal(18,2) NOT NULL,
    [quanlity] int NOT NULL,
    CONSTRAINT [PK_StaffOrderDetailFoods] PRIMARY KEY ([orderId], [foodInformationId]),
    CONSTRAINT [FK_StaffOrderDetailFoods_StaffOrder_orderId] FOREIGN KEY ([orderId]) REFERENCES [StaffOrder] ([orderId]) ON DELETE CASCADE,
    CONSTRAINT [FK_StaffOrderDetailFoods_foodInformation_foodInformationId] FOREIGN KEY ([foodInformationId]) REFERENCES [foodInformation] ([foodInformationId]) ON DELETE CASCADE
);
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'cinemaId', N'cinemaContactHotlineNumber', N'cinemaDescription', N'cinemaLocation', N'cinemaName', N'isDeleted') AND [object_id] = OBJECT_ID(N'[Cinema]'))
    SET IDENTITY_INSERT [Cinema] ON;
INSERT INTO [Cinema] ([cinemaId], [cinemaContactHotlineNumber], [cinemaDescription], [cinemaLocation], [cinemaName], [isDeleted])
VALUES ('2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', '0901234567', N'Rạp chiếu phim hiện đại với nhiều phòng chiếu.', N'123 Đường XYZ, TP.HCM', N'Rạp Chiếu Phim ABC', CAST(0 AS bit)),
('5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', '0987654321', N'Không gian ấm cúng, chất lượng hàng đầu.', N'456 Đường UVW, Hà Nội', N'Rạp Chiếu Phim LMN', CAST(0 AS bit));
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'cinemaId', N'cinemaContactHotlineNumber', N'cinemaDescription', N'cinemaLocation', N'cinemaName', N'isDeleted') AND [object_id] = OBJECT_ID(N'[Cinema]'))
    SET IDENTITY_INSERT [Cinema] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'HourScheduleID', N'HourScheduleShowTime') AND [object_id] = OBJECT_ID(N'[HourSchedule]'))
    SET IDENTITY_INSERT [HourSchedule] ON;
INSERT INTO [HourSchedule] ([HourScheduleID], [HourScheduleShowTime])
VALUES ('3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', '08:00'),
('4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e', '10:00'),
('5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', '14:00'),
('6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', '16:30'),
('7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', '19:00'),
('8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', '21:30');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'HourScheduleID', N'HourScheduleShowTime') AND [object_id] = OBJECT_ID(N'[HourSchedule]'))
    SET IDENTITY_INSERT [HourSchedule] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'languageId', N'languageDetail') AND [object_id] = OBJECT_ID(N'[Language]'))
    SET IDENTITY_INSERT [Language] ON;
INSERT INTO [Language] ([languageId], [languageDetail])
VALUES ('11d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e711', N'Korean'),
('22d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e722', N'Japanese'),
('c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8', N'Vietnamese'),
('d4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9', N'English');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'languageId', N'languageDetail') AND [object_id] = OBJECT_ID(N'[Language]'))
    SET IDENTITY_INSERT [Language] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'foodInformationId', N'foodImageURL', N'foodInformationName', N'foodPrice') AND [object_id] = OBJECT_ID(N'[foodInformation]'))
    SET IDENTITY_INSERT [foodInformation] ON;
INSERT INTO [foodInformation] ([foodInformationId], [foodImageURL], [foodInformationName], [foodPrice])
VALUES (N'2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a', N'https://recipeforperfection.com/wp-content/uploads/2017/11/Movie-Theater-Popcorn-in-a-popcorn-bucket.jpg', N'Popcorn', CAST(50000 AS bigint)),
(N'3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', N'https://product.hstatic.net/1000230954/product/z5097801162745_cc1e0be47992663fe974e135fb0fe2dd_3696c0b4f0c6405982bd558d8f26e0fc_1024x1024.jpg', N'Coca-Cola', CAST(25000 AS bigint)),
(N'4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c', N'https://www.stillwoodkitchen.com/wp-content/uploads/2023/02/DSC05431.jpg', N'Nachos', CAST(65000 AS bigint)),
(N'5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d', N'https://backend.awrestaurants.com/sites/default/files/styles/responsive_image_5x4/public/2024-11/Hot-Dog-Hot-Dog_0.jpg?itok=PfAxxdhG', N'Hot Dog', CAST(45000 AS bigint));
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'foodInformationId', N'foodImageURL', N'foodInformationName', N'foodPrice') AND [object_id] = OBJECT_ID(N'[foodInformation]'))
    SET IDENTITY_INSERT [foodInformation] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'minimumAgeID', N'minimumAgeDescription', N'minimumAgeInfo') AND [object_id] = OBJECT_ID(N'[minimumAges]'))
    SET IDENTITY_INSERT [minimumAges] ON;
INSERT INTO [minimumAges] ([minimumAgeID], [minimumAgeDescription], [minimumAgeInfo])
VALUES (N'6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d', N'Phim phù hợp với mọi lứa tuổi.', N'P'),
(N'7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', N'Phim dành cho khán giả từ 13 tuổi trở lên.', N'T13'),
(N'8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', N'Phim dành cho khán giả từ 16 tuổi trở lên.', N'T16'),
(N'9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', N'Phim dành cho khán giả từ 18 tuổi trở lên.', N'T18');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'minimumAgeID', N'minimumAgeDescription', N'minimumAgeInfo') AND [object_id] = OBJECT_ID(N'[minimumAges]'))
    SET IDENTITY_INSERT [minimumAges] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieGenreId', N'movieGenreName') AND [object_id] = OBJECT_ID(N'[movieGenre]'))
    SET IDENTITY_INSERT [movieGenre] ON;
INSERT INTO [movieGenre] ([movieGenreId], [movieGenreName])
VALUES ('a1a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c2', N'Kinh dị'),
('b2b7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c3', N'Khoa học viễn tưởng'),
('c3c7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c4', N'Lãng mạng'),
('d4d7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c5', N'Hoạt hình'),
('e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0', N'Hành động'),
('f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1', N'Hài hước');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieGenreId', N'movieGenreName') AND [object_id] = OBJECT_ID(N'[movieGenre]'))
    SET IDENTITY_INSERT [movieGenre] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieVisualFormatId', N'movieVisualFormatName') AND [object_id] = OBJECT_ID(N'[movieVisualFormat]'))
    SET IDENTITY_INSERT [movieVisualFormat] ON;
INSERT INTO [movieVisualFormat] ([movieVisualFormatId], [movieVisualFormatName])
VALUES ('5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', N'2D'),
('6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', N'3D'),
('7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', N'IMAX');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieVisualFormatId', N'movieVisualFormatName') AND [object_id] = OBJECT_ID(N'[movieVisualFormat]'))
    SET IDENTITY_INSERT [movieVisualFormat] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'priceInformationId', N'priceAmount') AND [object_id] = OBJECT_ID(N'[priceInformation]'))
    SET IDENTITY_INSERT [priceInformation] ON;
INSERT INTO [priceInformation] ([priceInformationId], [priceAmount])
VALUES ('0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e', CAST(80000 AS bigint)),
('1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f', CAST(120000 AS bigint)),
('2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a', CAST(70000 AS bigint)),
('3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', CAST(60000 AS bigint));
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'priceInformationId', N'priceAmount') AND [object_id] = OBJECT_ID(N'[priceInformation]'))
    SET IDENTITY_INSERT [priceInformation] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'roleId', N'roleName') AND [object_id] = OBJECT_ID(N'[roleInformation]'))
    SET IDENTITY_INSERT [roleInformation] ON;
INSERT INTO [roleInformation] ([roleId], [roleName])
VALUES ('1a8f7b9c-d4e5-4f6a-b7c8-9d0e1f2a3b4c', N'Cashier'),
('2b9c8d0e-f5a6-7b8c-d9e0-1f2a3b4c5d6e', N'Customer'),
('3c0d9e1f-a6b7-c8d9-e0f1-2a3b4c5d6e7f', N'Director'),
('4d1e0f2a-b7c8-d9e0-f1a2-3b4c5d6e7f8g', N'MovieManager'),
('5e2f1a3b-c8d9-e0f1-a2b3-4c5d6e7f8g9h', N'TheaterManager'),
('6f3a2b4c-d9e0-f1a2-b3c4-d5e6f7a8b9c0', N'FacilitiesManager');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'roleId', N'roleName') AND [object_id] = OBJECT_ID(N'[roleInformation]'))
    SET IDENTITY_INSERT [roleInformation] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'userId', N'loginUserEmail', N'loginUserPassword') AND [object_id] = OBJECT_ID(N'[userInformation]'))
    SET IDENTITY_INSERT [userInformation] ON;
INSERT INTO [userInformation] ([userId], [loginUserEmail], [loginUserPassword])
VALUES ('7b5d2c1e-9f8a-3e7b-c1d2-a0e9f8c7b6a5', 'theater@example.com', '$2a$12$FeLXQjfW3gfNFfELxTJS3.gH8o9Y2CB5WSGcDZxKMrPEJiR2RcxIS'),
('a1b2c3d4-e5f6-7a8b-c9d0-e1f2a3b4c5d6', 'admin@example.com', '$2a$12$hZw7TwWKR/cR2WRRn/Q1guTjMqLH6dYcchlw4sAimSU41bJ42r3Ka'),
('b2c3d4e5-f6a7-8b9c-d0e1-f2a3b4c5d6e7', 'user@example.com', '$2a$12$ADqBiSquthm1g7bLZvg6UulJ5QJFQQ6olUQzf66AQfJDGbQ2W1wlG'),
('e4e1f7d8-c3b2-4a90-8c67-2f5a1b3d9e0c', 'director@example.com', '$2a$12$91JfhncA5t3ssFtiaoKjSOrbMj7zON.wtL/n3cjme/wvK2kDCgZ7K'),
('f1a0e9b8-d7c6-5e4f-a3b2-1d0c9b8a7f6e', 'facilities@example.com', '$2a$12$CkugZHMrWhxG0h6hUqOAf.fX9QQFkLnfnLlI.xWCNZ1y/PivtfN2O');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'userId', N'loginUserEmail', N'loginUserPassword') AND [object_id] = OBJECT_ID(N'[userInformation]'))
    SET IDENTITY_INSERT [userInformation] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'userTypeId', N'userTypeDescription') AND [object_id] = OBJECT_ID(N'[userType]'))
    SET IDENTITY_INSERT [userType] ON;
INSERT INTO [userType] ([userTypeId], [userTypeDescription])
VALUES ('1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f', N'Adult'),
('2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a', N'Child'),
('3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', N'Student');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'userTypeId', N'userTypeDescription') AND [object_id] = OBJECT_ID(N'[userType]'))
    SET IDENTITY_INSERT [userType] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'IdentityCode', N'Name', N'dateOfBirth', N'phoneNumber', N'userID') AND [object_id] = OBJECT_ID(N'[Customers]'))
    SET IDENTITY_INSERT [Customers] ON;
INSERT INTO [Customers] ([Id], [IdentityCode], [Name], [dateOfBirth], [phoneNumber], [userID])
VALUES ('a1b2c3d4-e5f6-7a8b-c9d0-e1f2a3b4c5e1', '0123456789', N'Trần Anh Đức', '2005-09-19T00:00:00.0000000', '1234567890', 'b2c3d4e5-f6a7-8b9c-d0e1-f2a3b4c5d6e7');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'IdentityCode', N'Name', N'dateOfBirth', N'phoneNumber', N'userID') AND [object_id] = OBJECT_ID(N'[Customers]'))
    SET IDENTITY_INSERT [Customers] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name', N'cinemaID', N'dateOfBirth', N'phoneNumber', N'userID') AND [object_id] = OBJECT_ID(N'[Staff]'))
    SET IDENTITY_INSERT [Staff] ON;
INSERT INTO [Staff] ([Id], [Name], [cinemaID], [dateOfBirth], [phoneNumber], [userID])
VALUES ('d8d11645-73f0-4c54-a68e-88e8afe4c7e9', N'Director Staff', '2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', '1997-01-01T00:00:00.0000000', '0123456789', 'e4e1f7d8-c3b2-4a90-8c67-2f5a1b3d9e0c'),
('f1eb0376-dfda-4570-85f9-021469e5593b', N'Theater Manager Staff', '2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', '1997-01-01T00:00:00.0000000', '0123456789', '7b5d2c1e-9f8a-3e7b-c1d2-a0e9f8c7b6a5');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name', N'cinemaID', N'dateOfBirth', N'phoneNumber', N'userID') AND [object_id] = OBJECT_ID(N'[Staff]'))
    SET IDENTITY_INSERT [Staff] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'cinemaRoomId', N'cinemaId', N'cinemaRoomNumber', N'isDeleted', N'movieVisualFormatID') AND [object_id] = OBJECT_ID(N'[cinemaRoom]'))
    SET IDENTITY_INSERT [cinemaRoom] ON;
INSERT INTO [cinemaRoom] ([cinemaRoomId], [cinemaId], [cinemaRoomNumber], [isDeleted], [movieVisualFormatID])
VALUES ('6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', '2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', 1, CAST(0 AS bit), '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f'),
('7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', '2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', 2, CAST(0 AS bit), '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a'),
('8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', 1, CAST(0 AS bit), '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f'),
('9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', 2, CAST(0 AS bit), '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'cinemaRoomId', N'cinemaId', N'cinemaRoomNumber', N'isDeleted', N'movieVisualFormatID') AND [object_id] = OBJECT_ID(N'[cinemaRoom]'))
    SET IDENTITY_INSERT [cinemaRoom] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieId', N'ReleaseDate', N'isDelete', N'languageId', N'minimumAgeID', N'movieActor', N'movieDescription', N'movieDirector', N'movieDuration', N'movieImage', N'movieName', N'movieTrailerUrl') AND [object_id] = OBJECT_ID(N'[movieInformation]'))
    SET IDENTITY_INSERT [movieInformation] ON;
INSERT INTO [movieInformation] ([movieId], [ReleaseDate], [isDelete], [languageId], [minimumAgeID], [movieActor], [movieDescription], [movieDirector], [movieDuration], [movieImage], [movieName], [movieTrailerUrl])
VALUES ('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', '2020-11-01T00:00:00.0000000', CAST(0 AS bit), 'c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8', N'7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', N'Diễn Viên X, Diễn Viên Y', N'Đây là một bộ phim hành động đầy kịch tính.', N'Đạo Diễn A', 120, N'https://images.unsplash.com/flagged/photo-1577912504896-abc46b500434?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxhZGUlMjBydW5uZXIlMjAyMDQ5fGVufDB8fDB8fHww', N'Phim Hành Động 1', 'https://youtu.be/bNRzyCm2uME'),
('1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', '2025-12-01T00:00:00.0000000', CAST(0 AS bit), 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9', N'9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', N'Actor Z, Actress W', N'A funny movie for the whole family.', N'Director B', 90, N'https://media.wired.com/photos/59323c08aef9a462de9817dc/master/w_1800,h_1200,c_limit/ut_interstellarOpener_f.png', N'Comedy Film 1', 'https://youtu.be/yF2pXRJictA'),
('2f3a4b5c-6d7e-8f9a-0b1c2d3e4f5a6b7c', '2013-07-19T00:00:00.0000000', CAST(0 AS bit), 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9', N'9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', N'Vera Farmiga, Patrick Wilson', N'Dựa trên một câu chuyện có thật, phim theo chân hai nhà điều tra hiện tượng siêu nhiên.', N'James Wan', 112, N'https://www.tallengestore.com/cdn/shop/products/TINY_74e4fc80-aebb-484d-9025-014b40c61c8a.jpg?v=1530520655', N'Ám Ảnh Kinh Hoàng', 'https://youtu.be/bMgfsdYoEEo'),
('3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', '2014-11-07T00:00:00.0000000', CAST(0 AS bit), 'd4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9', N'7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', N'Matthew McConaughey, Anne Hathaway', N'Một nhóm các nhà du hành vũ trụ đi qua một hố sâu để tìm một ngôi nhà mới cho nhân loại.', N'Christopher Nolan', 169, N'https://www.posterposse.com/wp-content/uploads/2017/10/Blad-Runner-2049_-Orlando-Arocena-mexifunk_vectorart_2017.png', N'Hố Đen Du Hành', 'https://youtu.be/lbpduKrFRSc?feature=shared'),
('4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e', '2001-07-20T00:00:00.0000000', CAST(0 AS bit), '22d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e722', N'6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d', N'Rumi Hiiragi, Miyu Irino', N'Trong lúc chuyển nhà, cô bé Chihiro và gia đình đã lạc vào một thế giới của các vị thần.', N'Hayao Miyazaki', 125, N'https://images.thedirect.com/media/article_full/superman-logo.jpg', N'Vùng Đất Linh Hồn', 'https://youtu.be/VLS9xSsfxkQ');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieId', N'ReleaseDate', N'isDelete', N'languageId', N'minimumAgeID', N'movieActor', N'movieDescription', N'movieDirector', N'movieDuration', N'movieImage', N'movieName', N'movieTrailerUrl') AND [object_id] = OBJECT_ID(N'[movieInformation]'))
    SET IDENTITY_INSERT [movieInformation] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieVisualFormatId', N'priceInformationID', N'userTypeId') AND [object_id] = OBJECT_ID(N'[priceInformationForEachUserFilmType]'))
    SET IDENTITY_INSERT [priceInformationForEachUserFilmType] ON;
INSERT INTO [priceInformationForEachUserFilmType] ([movieVisualFormatId], [priceInformationID], [userTypeId])
VALUES ('5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', '0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e', '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f'),
('6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f', '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f'),
('7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f', '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f'),
('5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', '2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a'),
('5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', '2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieVisualFormatId', N'priceInformationID', N'userTypeId') AND [object_id] = OBJECT_ID(N'[priceInformationForEachUserFilmType]'))
    SET IDENTITY_INSERT [priceInformationForEachUserFilmType] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'roleId', N'userId') AND [object_id] = OBJECT_ID(N'[userRoleInformation]'))
    SET IDENTITY_INSERT [userRoleInformation] ON;
INSERT INTO [userRoleInformation] ([roleId], [userId])
VALUES ('1a8f7b9c-d4e5-4f6a-b7c8-9d0e1f2a3b4c', 'e4e1f7d8-c3b2-4a90-8c67-2f5a1b3d9e0c'),
('2b9c8d0e-f5a6-7b8c-d9e0-1f2a3b4c5d6e', 'b2c3d4e5-f6a7-8b9c-d0e1-f2a3b4c5d6e7'),
('3c0d9e1f-a6b7-c8d9-e0f1-2a3b4c5d6e7f', 'e4e1f7d8-c3b2-4a90-8c67-2f5a1b3d9e0c'),
('4d1e0f2a-b7c8-d9e0-f1a2-3b4c5d6e7f8g', 'a1b2c3d4-e5f6-7a8b-c9d0-e1f2a3b4c5d6'),
('4d1e0f2a-b7c8-d9e0-f1a2-3b4c5d6e7f8g', 'e4e1f7d8-c3b2-4a90-8c67-2f5a1b3d9e0c'),
('5e2f1a3b-c8d9-e0f1-a2b3-4c5d6e7f8g9h', '7b5d2c1e-9f8a-3e7b-c1d2-a0e9f8c7b6a5'),
('5e2f1a3b-c8d9-e0f1-a2b3-4c5d6e7f8g9h', 'e4e1f7d8-c3b2-4a90-8c67-2f5a1b3d9e0c'),
('6f3a2b4c-d9e0-f1a2-b3c4-d5e6f7a8b9c0', 'e4e1f7d8-c3b2-4a90-8c67-2f5a1b3d9e0c'),
('6f3a2b4c-d9e0-f1a2-b3c4-d5e6f7a8b9c0', 'f1a0e9b8-d7c6-5e4f-a3b2-1d0c9b8a7f6e');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'roleId', N'userId') AND [object_id] = OBJECT_ID(N'[userRoleInformation]'))
    SET IDENTITY_INSERT [userRoleInformation] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'seatsId', N'cinemaRoomId', N'isDelete', N'isTaken', N'seatsNumber') AND [object_id] = OBJECT_ID(N'[Seats]'))
    SET IDENTITY_INSERT [Seats] ON;
INSERT INTO [Seats] ([seatsId], [cinemaRoomId], [isDelete], [isTaken], [seatsNumber])
VALUES ('11111111-2d3e-4f5a-6b7c-8d9e0f1a2b3c', '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', CAST(0 AS bit), CAST(0 AS bit), 'B1'),
('22222222-3e4f-5a6b-7c8d-9e0f1a2b3c4d', '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', CAST(0 AS bit), CAST(0 AS bit), 'B2'),
('33333333-4f5a-6b7c-8d9e-0f1a2b3c4d5e', '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', CAST(0 AS bit), CAST(0 AS bit), 'B3'),
('44444444-5a6b-7c8d-9e0f-1a2b3c4d5e6f', '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', CAST(0 AS bit), CAST(0 AS bit), 'C1'),
('55555555-6b7c-8d9e-0f1a-2b3c4d5e6f7a', '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', CAST(0 AS bit), CAST(0 AS bit), 'C2'),
('66666666-7c8d-9e0f-1a2b-3c4d5e6f7a8b', '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', CAST(0 AS bit), CAST(0 AS bit), 'D1'),
('77777777-8d9e-0f1a-2b3c-4d5e6f7a8b9c', '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', CAST(0 AS bit), CAST(0 AS bit), 'D2'),
('8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', CAST(0 AS bit), CAST(0 AS bit), 'A1'),
('9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', CAST(0 AS bit), CAST(0 AS bit), 'A2'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', CAST(0 AS bit), CAST(0 AS bit), 'A3'),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', CAST(0 AS bit), CAST(0 AS bit), 'A4'),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', CAST(0 AS bit), CAST(0 AS bit), 'A5'),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', CAST(0 AS bit), CAST(0 AS bit), 'A6'),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', CAST(0 AS bit), CAST(0 AS bit), 'A7'),
('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', CAST(0 AS bit), CAST(0 AS bit), 'A8');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'seatsId', N'cinemaRoomId', N'isDelete', N'isTaken', N'seatsNumber') AND [object_id] = OBJECT_ID(N'[Seats]'))
    SET IDENTITY_INSERT [Seats] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieGenreId', N'movieId') AND [object_id] = OBJECT_ID(N'[movieGenreInformation]'))
    SET IDENTITY_INSERT [movieGenreInformation] ON;
INSERT INTO [movieGenreInformation] ([movieGenreId], [movieId])
VALUES ('e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0', '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a'),
('f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1', '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b'),
('a1a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c2', '2f3a4b5c-6d7e-8f9a-0b1c2d3e4f5a6b7c'),
('b2b7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c3', '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d'),
('e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0', '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d'),
('d4d7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c5', '4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieGenreId', N'movieId') AND [object_id] = OBJECT_ID(N'[movieGenreInformation]'))
    SET IDENTITY_INSERT [movieGenreInformation] OFF;
GO


IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieScheduleId', N'DayInWeekendSchedule', N'HourScheduleID', N'IsDelete', N'ScheduleDate', N'cinemaRoomId', N'movieId', N'movieVisualFormatID') AND [object_id] = OBJECT_ID(N'[movieSchedule]'))
    SET IDENTITY_INSERT [movieSchedule] ON;
INSERT INTO [movieSchedule] ([movieScheduleId], [DayInWeekendSchedule], [HourScheduleID], [IsDelete], [ScheduleDate], [cinemaRoomId], [movieId], [movieVisualFormatID])
VALUES ('7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', N'Monday', '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', CAST(0 AS bit), '2025-11-11T00:00:00.0000000', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f'),
('8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', N'Friday', '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', CAST(0 AS bit), '2025-11-15T00:00:00.0000000', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', '2f3a4b5c-6d7e-8f9a-0b1c2d3e4f5a6b7c', '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f'),
('9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', N'Saturday', '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', CAST(0 AS bit), '2025-11-16T00:00:00.0000000', '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b'),
('a1b2c3d4-e5f6-7a8b-c9d0-e1f2a3b4c5d6', N'Sunday', '4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e', CAST(0 AS bit), '2025-11-17T00:00:00.0000000', '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', '4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e', '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'movieScheduleId', N'DayInWeekendSchedule', N'HourScheduleID', N'IsDelete', N'ScheduleDate', N'cinemaRoomId', N'movieId', N'movieVisualFormatID') AND [object_id] = OBJECT_ID(N'[movieSchedule]'))
    SET IDENTITY_INSERT [movieSchedule] OFF;
GO


CREATE INDEX [IX_cinemaRoom_cinemaId] ON [cinemaRoom] ([cinemaId]);
GO


CREATE INDEX [IX_cinemaRoom_movieVisualFormatID] ON [cinemaRoom] ([movieVisualFormatID]);
GO


CREATE UNIQUE INDEX [IX_Customers_phoneNumber] ON [Customers] ([phoneNumber]);
GO


CREATE UNIQUE INDEX [IX_Customers_userID] ON [Customers] ([userID]);
GO


CREATE INDEX [IX_EmailList_UserId] ON [EmailList] ([UserId]);
GO


CREATE INDEX [IX_FoodOrderDetail_foodInformationId] ON [FoodOrderDetail] ([foodInformationId]);
GO


CREATE UNIQUE INDEX [IX_HourSchedule_HourScheduleShowTime] ON [HourSchedule] ([HourScheduleShowTime]);
GO


CREATE UNIQUE INDEX [IX_Language_languageDetail] ON [Language] ([languageDetail]);
GO


CREATE UNIQUE INDEX [IX_minimumAges_minimumAgeDescription] ON [minimumAges] ([minimumAgeDescription]);
GO


CREATE UNIQUE INDEX [IX_minimumAges_minimumAgeInfo] ON [minimumAges] ([minimumAgeInfo]);
GO


CREATE INDEX [IX_movieCommentDetail_customerID] ON [movieCommentDetail] ([customerID]);
GO


CREATE INDEX [IX_movieCommentDetail_movieId] ON [movieCommentDetail] ([movieId]);
GO


CREATE UNIQUE INDEX [IX_movieGenre_movieGenreName] ON [movieGenre] ([movieGenreName]);
GO


CREATE INDEX [IX_movieGenreInformation_movieGenreId] ON [movieGenreInformation] ([movieGenreId]);
GO


CREATE INDEX [IX_movieInformation_languageId] ON [movieInformation] ([languageId]);
GO


CREATE INDEX [IX_movieInformation_minimumAgeID] ON [movieInformation] ([minimumAgeID]);
GO


CREATE UNIQUE INDEX [IX_movieInformation_movieImage] ON [movieInformation] ([movieImage]);
GO


CREATE UNIQUE INDEX [IX_movieInformation_movieName] ON [movieInformation] ([movieName]);
GO


CREATE UNIQUE INDEX [IX_movieInformation_movieTrailerUrl] ON [movieInformation] ([movieTrailerUrl]);
GO


CREATE UNIQUE INDEX [IX_movieSchedule_cinemaRoomId_ScheduleDate] ON [movieSchedule] ([cinemaRoomId], [ScheduleDate]);
GO


CREATE UNIQUE INDEX [IX_movieSchedule_cinemaRoomId_ScheduleDate_HourScheduleID] ON [movieSchedule] ([cinemaRoomId], [ScheduleDate], [HourScheduleID]) WHERE [IsDelete] = CAST(0 AS BIT);
GO


CREATE INDEX [IX_movieSchedule_HourScheduleID] ON [movieSchedule] ([HourScheduleID]);
GO


CREATE UNIQUE INDEX [IX_movieSchedule_movieId_ScheduleDate_HourScheduleID] ON [movieSchedule] ([movieId], [ScheduleDate], [HourScheduleID]) WHERE [IsDelete] = CAST(0 AS BIT);
GO


CREATE INDEX [IX_movieSchedule_movieVisualFormatID] ON [movieSchedule] ([movieVisualFormatID]);
GO


CREATE UNIQUE INDEX [IX_movieVisualFormat_movieVisualFormatName] ON [movieVisualFormat] ([movieVisualFormatName]);
GO


CREATE INDEX [IX_movieVisualFormatDetails_movieVisualFormatId] ON [movieVisualFormatDetails] ([movieVisualFormatId]);
GO


CREATE INDEX [IX_Order_customerID] ON [Order] ([customerID]);
GO


CREATE UNIQUE INDEX [IX_priceInformation_priceAmount] ON [priceInformation] ([priceAmount]);
GO


CREATE INDEX [IX_priceInformationForEachUserFilmType_movieVisualFormatId] ON [priceInformationForEachUserFilmType] ([movieVisualFormatId]);
GO


CREATE INDEX [IX_priceInformationForEachUserFilmType_priceInformationID] ON [priceInformationForEachUserFilmType] ([priceInformationID]);
GO


CREATE UNIQUE INDEX [IX_roleInformation_roleName] ON [roleInformation] ([roleName]);
GO


CREATE INDEX [IX_Seats_cinemaRoomId] ON [Seats] ([cinemaRoomId]);
GO


CREATE INDEX [IX_Seats_seatsId] ON [Seats] ([seatsId]);
GO


CREATE INDEX [IX_Staff_cinemaID] ON [Staff] ([cinemaID]);
GO


CREATE UNIQUE INDEX [IX_Staff_phoneNumber] ON [Staff] ([phoneNumber]);
GO


CREATE UNIQUE INDEX [IX_Staff_userID] ON [Staff] ([userID]);
GO


CREATE INDEX [IX_StaffOrder_StaffID] ON [StaffOrder] ([StaffID]);
GO


CREATE INDEX [IX_StaffOrderDetailFoods_foodInformationId] ON [StaffOrderDetailFoods] ([foodInformationId]);
GO


CREATE INDEX [IX_TicketOrderDetail_movieScheduleID] ON [TicketOrderDetail] ([movieScheduleID]);
GO


CREATE INDEX [IX_TicketOrderDetail_orderId] ON [TicketOrderDetail] ([orderId]);
GO


CREATE UNIQUE INDEX [IX_userInformation_loginUserEmail] ON [userInformation] ([loginUserEmail]);
GO


CREATE INDEX [IX_userRoleInformation_userId] ON [userRoleInformation] ([userId]);
GO


CREATE UNIQUE INDEX [IX_userType_userTypeDescription] ON [userType] ([userTypeDescription]);
GO


