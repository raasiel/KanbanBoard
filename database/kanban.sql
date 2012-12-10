
--Create database

USE [master]
GO
IF NOT EXISTS (SELECT [name] FROM sys.databases WHERE name = N'KanbanTFS')
BEGIN
CREATE DATABASE [KanbanTFS] COLLATE SQL_Latin1_General_CP1_CI_AS
END
GO
EXEC dbo.sp_dbcmptlevel @dbname=N'KanbanTFS', @new_cmptlevel=110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
BEGIN
	EXEC [KanbanTFS].[dbo].[sp_fulltext_database] @action = 'enable'
END
GO
ALTER DATABASE [KanbanTFS] SET ANSI_NULL_DEFAULT ON
GO
ALTER DATABASE [KanbanTFS] SET ANSI_NULLS ON
GO
ALTER DATABASE [KanbanTFS] SET ANSI_PADDING ON
GO
ALTER DATABASE [KanbanTFS] SET ANSI_WARNINGS ON
GO
ALTER DATABASE [KanbanTFS] SET ARITHABORT ON
GO
ALTER DATABASE [KanbanTFS] SET AUTO_CLOSE OFF
GO
ALTER DATABASE [KanbanTFS] SET AUTO_CREATE_STATISTICS ON
GO
ALTER DATABASE [KanbanTFS] SET AUTO_SHRINK OFF
GO
ALTER DATABASE [KanbanTFS] SET AUTO_UPDATE_STATISTICS ON
GO
ALTER DATABASE [KanbanTFS] SET CURSOR_CLOSE_ON_COMMIT OFF
GO
ALTER DATABASE [KanbanTFS] SET CURSOR_DEFAULT LOCAL
GO
ALTER DATABASE [KanbanTFS] SET CONCAT_NULL_YIELDS_NULL ON
GO
ALTER DATABASE [KanbanTFS] SET NUMERIC_ROUNDABORT OFF
GO
ALTER DATABASE [KanbanTFS] SET QUOTED_IDENTIFIER ON
GO
ALTER DATABASE [KanbanTFS] SET RECURSIVE_TRIGGERS OFF
GO
ALTER DATABASE [KanbanTFS] SET DISABLE_BROKER
GO
ALTER DATABASE [KanbanTFS] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
ALTER DATABASE [KanbanTFS] SET DATE_CORRELATION_OPTIMIZATION OFF
GO
ALTER DATABASE [KanbanTFS] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [KanbanTFS] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [KanbanTFS] SET ALLOW_SNAPSHOT_ISOLATION OFF
GO
ALTER DATABASE [KanbanTFS] SET PARAMETERIZATION SIMPLE
GO
ALTER DATABASE [KanbanTFS] SET READ_WRITE
GO
ALTER DATABASE [KanbanTFS] SET RECOVERY FULL
GO
ALTER DATABASE [KanbanTFS] SET MULTI_USER
GO
ALTER DATABASE [KanbanTFS] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [KanbanTFS] SET DB_CHAINING OFF
GO

USE [KanbanTFS]
GO

--Table dbo.Project

USE [KanbanTFS]
GO

--Create table and its columns
CREATE TABLE [dbo].[Project] (
	[ProjectID] [int] NOT NULL IDENTITY (1, 1),
	[Name] [varchar](256) NOT NULL,
	[AdminID] [int] NOT NULL,
	[TfsQueryID] [int] NULL,
	[SyncInterval] [int] NULL);
GO

SET IDENTITY_INSERT [dbo].[Project] ON
GO
INSERT INTO [dbo].[Project] ([ProjectID], [Name], [AdminID], [TfsQueryID], [SyncInterval])
	VALUES (1, N'BBE NextGen', 1, NULL, NULL)

GO
INSERT INTO [dbo].[Project] ([ProjectID], [Name], [AdminID], [TfsQueryID], [SyncInterval])
	VALUES (2, N'AML', 1, NULL, NULL)

GO
SET IDENTITY_INSERT [dbo].[Project] OFF
GO

--Table dbo.ProjectStatus

USE [KanbanTFS]
GO

--Create table and its columns
CREATE TABLE [dbo].[ProjectStatus] (
	[ProjectStatusID] [int] NOT NULL IDENTITY (1, 1),
	[ProjectID] [int] NOT NULL,
	[Name] [varchar](256) NULL);
GO

SET IDENTITY_INSERT [dbo].[ProjectStatus] ON
GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (1, 1, N'Queue')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (2, 1, N'Clarify')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (3, 1, N'Estimate')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (4, 1, N'In Progress')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (6, 1, N'Dev Complete')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (7, 1, N'QA')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (8, 1, N'Delivery')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (9, 1, N'Close')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (10, 2, N'Queue')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (11, 2, N'Clarify')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (12, 2, N'In Progress')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (13, 2, N'Dev Complete')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (14, 2, N'Func Testing')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (15, 2, N'Integration Test')

GO
INSERT INTO [dbo].[ProjectStatus] ([ProjectStatusID], [ProjectID], [Name])
	VALUES (16, 2, N'Submit')

GO
SET IDENTITY_INSERT [dbo].[ProjectStatus] OFF
GO

--Table dbo.Task

USE [KanbanTFS]
GO

--Create table and its columns
CREATE TABLE [dbo].[Task] (
	[TaskID] [int] NOT NULL IDENTITY (1, 1),
	[TFSTaskID] [int] NULL,
	[Title] [varchar](256) NOT NULL,
	[Descriptions] [varchar](MAX) NOT NULL,
	[Comments] [varchar](MAX) NULL,
	[ProjectID] [int] NULL,
	[UserID] [int] NOT NULL,
	[StatusID] [int] NOT NULL);
GO

SET IDENTITY_INSERT [dbo].[Task] ON
GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (1, 0, N'Create a basic kanban board that shows task status and responsibility', N'Description', N' ', 1, 2, 1)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (2, 0, N'TFS import support', N'Import work item from TFS', N' ', 1, 2, 3)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (3, 0, N'Show TFS to Task Screen', N' ', N' ', 1, 2, 3)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (5, 0, N'List TFS Items', N' ', N' ', 1, 2, 2)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (6, 0, N'Enable multi user', N' ', N' ', 1, 2, 3)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (7, 0, N'Build New task Screen', N' ', N' ', 1, 2, 2)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (8, 0, N'Add tagging feature', N' ', N' ', 1, 2, 6)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (11, 0, N'8391 - is a cool project is that will work fine.', N'Some thing needs to happen ', N' ', 2, 5, 10)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (12, 0, N'8724', N' ', N' ', 2, 5, 16)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (13, 0, N'8734', N' ', N' ', 2, 5, 14)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (14, 0, N'9903 - update this task test', N' ', N' ', 2, 5, 10)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (15, 0, N'This is a cool thing ok', N' ', N' ', 2, 5, 12)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (16, 0, N'Create a multiuser system for this task. ', N' Would I not, I guess not
No Idea', N' ', 2, 9, 13)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (17, 0, N'Make sure this is a cool task.', N'This is a cool ', N' ', 2, 5, 10)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (18, 0, N'9829', N' ', N' ', 2, 5, 13)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (19, 0, N'Test', N' ', N' ', 2, 8, 15)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (20, 0, N'We need to finish this task test', N'This is a cool thing to do
But this is fine ', N' ', 2, 5, 11)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (22, 0, N'9830', N' ', N' ', 2, 8, 16)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (23, 0, N'9831 - test', N'This is fun 
asdasd', N' ', 2, 7, 12)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (24, 0, N'9772', N' ', N' ', 2, 5, 15)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (25, 0, N'9696', N'dasds
adsd
sa ', N' ', 2, 9, 16)

GO
INSERT INTO [dbo].[Task] ([TaskID], [TFSTaskID], [Title], [Descriptions], [Comments], [ProjectID], [UserID], [StatusID])
	VALUES (26, 0, N'This is a cool task - tes', N' ', N' ', 2, 8, 13)

GO
SET IDENTITY_INSERT [dbo].[Task] OFF
GO

--Table dbo.TfsConnection

USE [KanbanTFS]
GO

--Create table and its columns
CREATE TABLE [dbo].[TfsConnection] (
	[TfsConfigID] [int] NOT NULL IDENTITY (1, 1),
	[TfsUrl] [nvarchar](150) NOT NULL,
	[Username] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](50) NOT NULL,
	[ProjectCollectionGuid] [varchar](50) NULL,
	[Domain] [varchar](20) NOT NULL);
GO

SET IDENTITY_INSERT [dbo].[TfsConnection] ON
GO
INSERT INTO [dbo].[TfsConnection] ([TfsConfigID], [TfsUrl], [Username], [Password], [ProjectCollectionGuid], [Domain])
	VALUES (1, N'https://cmr.wkglobal.com:8088/tfs', N'Shafqat.Ahmed', N'Hello123', NULL, N'NA')

GO
SET IDENTITY_INSERT [dbo].[TfsConnection] OFF
GO

--Table dbo.TfsQuery

USE [KanbanTFS]
GO

--Create table and its columns
CREATE TABLE [dbo].[TfsQuery] (
	[TfsQueryID] [int] NOT NULL IDENTITY (1, 1),
	[QuerySrting] [nvarchar](MAX) NOT NULL,
	[TfsConfigID] [int] NULL);
GO

--Table dbo.TFSWorkItem

USE [KanbanTFS]
GO

--Create table and its columns
CREATE TABLE [dbo].[TFSWorkItem] (
	[WorkItemID] [int] NOT NULL,
	[Title] [varchar](256) NOT NULL,
	[Descriptions] [varchar](256) NULL,
	[AssignedTo] [varchar](256) NULL,
	[Attachement] [varchar](256) NULL,
	[Converted] [bit] NOT NULL);
GO

INSERT INTO [dbo].[TFSWorkItem] ([WorkItemID], [Title], [Descriptions], [AssignedTo], [Attachement], [Converted])
	VALUES (0, N' ', N' ', N'No one', N' ', CAST ('False' AS bit))

GO

--Table dbo.User

USE [KanbanTFS]
GO

--Create table and its columns
CREATE TABLE [dbo].[User] (
	[UserID] [int] NOT NULL IDENTITY (1, 1),
	[Email] [varchar](256) NOT NULL,
	[Password] [varchar](256) NOT NULL,
	[Name] [nvarchar](50) NULL);
GO

SET IDENTITY_INSERT [dbo].[User] ON
GO
INSERT INTO [dbo].[User] ([UserID], [Email], [Password], [Name])
	VALUES (1, N'shafqatahmed@gmail.com', N'orion123', N'Shafqat')

GO
INSERT INTO [dbo].[User] ([UserID], [Email], [Password], [Name])
	VALUES (2, N'azad@onirban.net', N'orion123', N'Azad')

GO
INSERT INTO [dbo].[User] ([UserID], [Email], [Password], [Name])
	VALUES (3, N'mahabub_shikder@onirban.net', N'orion123', N'Mahabub')

GO
INSERT INTO [dbo].[User] ([UserID], [Email], [Password], [Name])
	VALUES (4, N'abdur_rahman@onirban.net', N'orion123', N'Shuman')

GO
INSERT INTO [dbo].[User] ([UserID], [Email], [Password], [Name])
	VALUES (5, N'shahjada_talukder@onirban.net', N'orion123', N'Masum')

GO
INSERT INTO [dbo].[User] ([UserID], [Email], [Password], [Name])
	VALUES (7, N'saiful_islam@onirban.net', N'orion123', N'Saif')

GO
INSERT INTO [dbo].[User] ([UserID], [Email], [Password], [Name])
	VALUES (8, N'utpal_das@onirban.net', N'orion123', N'Utpal')

GO
INSERT INTO [dbo].[User] ([UserID], [Email], [Password], [Name])
	VALUES (9, N'saad_mahmud@onirban.net', N'orion123', N'Saad')

GO
SET IDENTITY_INSERT [dbo].[User] OFF
GO

--Table dbo.UserProjectMap

USE [KanbanTFS]
GO

--Create table and its columns
CREATE TABLE [dbo].[UserProjectMap] (
	[ProjectID] [int] NOT NULL,
	[UserID] [int] NOT NULL);
GO

INSERT INTO [dbo].[UserProjectMap] ([ProjectID], [UserID])
	VALUES (1, 1)

GO
INSERT INTO [dbo].[UserProjectMap] ([ProjectID], [UserID])
	VALUES (1, 2)

GO
INSERT INTO [dbo].[UserProjectMap] ([ProjectID], [UserID])
	VALUES (1, 3)

GO
INSERT INTO [dbo].[UserProjectMap] ([ProjectID], [UserID])
	VALUES (1, 4)

GO
INSERT INTO [dbo].[UserProjectMap] ([ProjectID], [UserID])
	VALUES (2, 5)

GO
INSERT INTO [dbo].[UserProjectMap] ([ProjectID], [UserID])
	VALUES (2, 7)

GO
INSERT INTO [dbo].[UserProjectMap] ([ProjectID], [UserID])
	VALUES (2, 8)

GO
INSERT INTO [dbo].[UserProjectMap] ([ProjectID], [UserID])
	VALUES (2, 9)

GO

--Executing Entities
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO
CREATE procedure [dbo].[GetProjectBoard] 
(
	@ProjectID int 
)
AS

	select 
		t.TaskID, 
		T.Title, 
		T.[Descriptions],
		T.[Comments],
		ps.[Name] as [Status],
		t.[UserID],
		ps.[ProjectStatusID] as StatusID,
		t.TFSTaskID as WIRef
	from task t
	inner join ProjectStatus ps 
	on t.StatusID = ps.ProjectStatusID
	where t.ProjectID=@ProjectID
GO

GO

--Indexes of table dbo.Project
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [PK__Project__761ABED0211E1B03] PRIMARY KEY CLUSTERED ([ProjectID]) 
GO

--Indexes of table dbo.ProjectStatus
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TABLE [dbo].[ProjectStatus] ADD CONSTRAINT [PK__ProjectS__F3B67D2DE0AF41CD] PRIMARY KEY CLUSTERED ([ProjectStatusID]) 
GO

--Indexes of table dbo.Task
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TABLE [dbo].[Task] ADD CONSTRAINT [PK__Task__7C6949D18A30D966] PRIMARY KEY CLUSTERED ([TaskID]) 
GO

--Indexes of table dbo.TfsConnection
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TABLE [dbo].[TfsConnection] ADD CONSTRAINT [PK__TfsConne__28796F91E4D29961] PRIMARY KEY CLUSTERED ([TfsConfigID]) 
GO

--Indexes of table dbo.TfsQuery
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TABLE [dbo].[TfsQuery] ADD CONSTRAINT [PK__TfsQuery__2FDFD0786EF6E356] PRIMARY KEY CLUSTERED ([TfsQueryID]) 
GO

--Indexes of table dbo.TFSWorkItem
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TABLE [dbo].[TFSWorkItem] ADD CONSTRAINT [PK__TFSWorkI__A10D1B65B9074A95] PRIMARY KEY CLUSTERED ([WorkItemID]) 
GO

--Indexes of table dbo.User
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TABLE [dbo].[User] ADD CONSTRAINT [PK__User__1788CCACD76F6E8F] PRIMARY KEY CLUSTERED ([UserID]) 
GO

--Indexes of table dbo.UserProjectMap
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TABLE [dbo].[UserProjectMap] ADD CONSTRAINT [PK_UserProjectMap] PRIMARY KEY CLUSTERED ([ProjectID], [UserID]) 
GO

--Foreign Keys

USE [KanbanTFS]
GO
ALTER TABLE [dbo].[ProjectStatus] WITH CHECK ADD CONSTRAINT [FK__ProjectSt__Proje__1CF15040] 
	FOREIGN KEY ([ProjectID]) REFERENCES [dbo].[Project] ([ProjectID])
	ON UPDATE NO ACTION
	ON DELETE NO ACTION
GO
ALTER TABLE [dbo].[ProjectStatus] CHECK CONSTRAINT [FK__ProjectSt__Proje__1CF15040]
GO
ALTER TABLE [dbo].[Task] WITH CHECK ADD CONSTRAINT [FK__Task__ProjectID__1DE57479] 
	FOREIGN KEY ([ProjectID]) REFERENCES [dbo].[Project] ([ProjectID])
	ON UPDATE NO ACTION
	ON DELETE NO ACTION
GO
ALTER TABLE [dbo].[Task] CHECK CONSTRAINT [FK__Task__ProjectID__1DE57479]
GO
ALTER TABLE [dbo].[Task] WITH CHECK ADD CONSTRAINT [FK__Task__StatusID__267ABA7A] 
	FOREIGN KEY ([StatusID]) REFERENCES [dbo].[ProjectStatus] ([ProjectStatusID])
	ON UPDATE NO ACTION
	ON DELETE NO ACTION
GO
ALTER TABLE [dbo].[Task] CHECK CONSTRAINT [FK__Task__StatusID__267ABA7A]
GO
ALTER TABLE [dbo].[Task] WITH CHECK ADD CONSTRAINT [FK__Task__UserID__24927208] 
	FOREIGN KEY ([UserID]) REFERENCES [dbo].[User] ([UserID])
	ON UPDATE NO ACTION
	ON DELETE NO ACTION
GO
ALTER TABLE [dbo].[Task] CHECK CONSTRAINT [FK__Task__UserID__24927208]
GO
ALTER TABLE [dbo].[TfsQuery] WITH CHECK ADD CONSTRAINT [FK__TfsQuery__TfsCon__38996AB5] 
	FOREIGN KEY ([TfsConfigID]) REFERENCES [dbo].[TfsConnection] ([TfsConfigID])
	ON UPDATE NO ACTION
	ON DELETE NO ACTION
GO
ALTER TABLE [dbo].[TfsQuery] CHECK CONSTRAINT [FK__TfsQuery__TfsCon__38996AB5]
GO
ALTER TABLE [dbo].[UserProjectMap] WITH CHECK ADD CONSTRAINT [FK__UserProje__Proje__21B6055D] 
	FOREIGN KEY ([ProjectID]) REFERENCES [dbo].[Project] ([ProjectID])
	ON UPDATE NO ACTION
	ON DELETE NO ACTION
GO
ALTER TABLE [dbo].[UserProjectMap] CHECK CONSTRAINT [FK__UserProje__Proje__21B6055D]
GO
ALTER TABLE [dbo].[UserProjectMap] WITH CHECK ADD CONSTRAINT [FK__UserProje__UserI__22AA2996] 
	FOREIGN KEY ([UserID]) REFERENCES [dbo].[User] ([UserID])
	ON UPDATE NO ACTION
	ON DELETE NO ACTION
GO
ALTER TABLE [dbo].[UserProjectMap] CHECK CONSTRAINT [FK__UserProje__UserI__22AA2996]
GO
