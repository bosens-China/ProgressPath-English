/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as ManageImport } from './routes/_manage'
import { Route as IndexImport } from './routes/index'
import { Route as ManageUsersIndexImport } from './routes/_manage/users/index'
import { Route as ManageSectionsIndexImport } from './routes/_manage/sections/index'
import { Route as ManageQuestionsIndexImport } from './routes/_manage/questions/index'
import { Route as ManageQuestionTypesIndexImport } from './routes/_manage/question-types/index'
import { Route as ManageDifyManageIndexImport } from './routes/_manage/dify-manage/index'
import { Route as ManageCoursesIndexImport } from './routes/_manage/courses/index'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const ManageRoute = ManageImport.update({
  id: '/_manage',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ManageUsersIndexRoute = ManageUsersIndexImport.update({
  id: '/users/',
  path: '/users/',
  getParentRoute: () => ManageRoute,
} as any)

const ManageSectionsIndexRoute = ManageSectionsIndexImport.update({
  id: '/sections/',
  path: '/sections/',
  getParentRoute: () => ManageRoute,
} as any)

const ManageQuestionsIndexRoute = ManageQuestionsIndexImport.update({
  id: '/questions/',
  path: '/questions/',
  getParentRoute: () => ManageRoute,
} as any)

const ManageQuestionTypesIndexRoute = ManageQuestionTypesIndexImport.update({
  id: '/question-types/',
  path: '/question-types/',
  getParentRoute: () => ManageRoute,
} as any)

const ManageDifyManageIndexRoute = ManageDifyManageIndexImport.update({
  id: '/dify-manage/',
  path: '/dify-manage/',
  getParentRoute: () => ManageRoute,
} as any)

const ManageCoursesIndexRoute = ManageCoursesIndexImport.update({
  id: '/courses/',
  path: '/courses/',
  getParentRoute: () => ManageRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_manage': {
      id: '/_manage'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof ManageImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_manage/courses/': {
      id: '/_manage/courses/'
      path: '/courses'
      fullPath: '/courses'
      preLoaderRoute: typeof ManageCoursesIndexImport
      parentRoute: typeof ManageImport
    }
    '/_manage/dify-manage/': {
      id: '/_manage/dify-manage/'
      path: '/dify-manage'
      fullPath: '/dify-manage'
      preLoaderRoute: typeof ManageDifyManageIndexImport
      parentRoute: typeof ManageImport
    }
    '/_manage/question-types/': {
      id: '/_manage/question-types/'
      path: '/question-types'
      fullPath: '/question-types'
      preLoaderRoute: typeof ManageQuestionTypesIndexImport
      parentRoute: typeof ManageImport
    }
    '/_manage/questions/': {
      id: '/_manage/questions/'
      path: '/questions'
      fullPath: '/questions'
      preLoaderRoute: typeof ManageQuestionsIndexImport
      parentRoute: typeof ManageImport
    }
    '/_manage/sections/': {
      id: '/_manage/sections/'
      path: '/sections'
      fullPath: '/sections'
      preLoaderRoute: typeof ManageSectionsIndexImport
      parentRoute: typeof ManageImport
    }
    '/_manage/users/': {
      id: '/_manage/users/'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof ManageUsersIndexImport
      parentRoute: typeof ManageImport
    }
  }
}

// Create and export the route tree

interface ManageRouteChildren {
  ManageCoursesIndexRoute: typeof ManageCoursesIndexRoute
  ManageDifyManageIndexRoute: typeof ManageDifyManageIndexRoute
  ManageQuestionTypesIndexRoute: typeof ManageQuestionTypesIndexRoute
  ManageQuestionsIndexRoute: typeof ManageQuestionsIndexRoute
  ManageSectionsIndexRoute: typeof ManageSectionsIndexRoute
  ManageUsersIndexRoute: typeof ManageUsersIndexRoute
}

const ManageRouteChildren: ManageRouteChildren = {
  ManageCoursesIndexRoute: ManageCoursesIndexRoute,
  ManageDifyManageIndexRoute: ManageDifyManageIndexRoute,
  ManageQuestionTypesIndexRoute: ManageQuestionTypesIndexRoute,
  ManageQuestionsIndexRoute: ManageQuestionsIndexRoute,
  ManageSectionsIndexRoute: ManageSectionsIndexRoute,
  ManageUsersIndexRoute: ManageUsersIndexRoute,
}

const ManageRouteWithChildren =
  ManageRoute._addFileChildren(ManageRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof ManageRouteWithChildren
  '/login': typeof LoginRoute
  '/courses': typeof ManageCoursesIndexRoute
  '/dify-manage': typeof ManageDifyManageIndexRoute
  '/question-types': typeof ManageQuestionTypesIndexRoute
  '/questions': typeof ManageQuestionsIndexRoute
  '/sections': typeof ManageSectionsIndexRoute
  '/users': typeof ManageUsersIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof ManageRouteWithChildren
  '/login': typeof LoginRoute
  '/courses': typeof ManageCoursesIndexRoute
  '/dify-manage': typeof ManageDifyManageIndexRoute
  '/question-types': typeof ManageQuestionTypesIndexRoute
  '/questions': typeof ManageQuestionsIndexRoute
  '/sections': typeof ManageSectionsIndexRoute
  '/users': typeof ManageUsersIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_manage': typeof ManageRouteWithChildren
  '/login': typeof LoginRoute
  '/_manage/courses/': typeof ManageCoursesIndexRoute
  '/_manage/dify-manage/': typeof ManageDifyManageIndexRoute
  '/_manage/question-types/': typeof ManageQuestionTypesIndexRoute
  '/_manage/questions/': typeof ManageQuestionsIndexRoute
  '/_manage/sections/': typeof ManageSectionsIndexRoute
  '/_manage/users/': typeof ManageUsersIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/login'
    | '/courses'
    | '/dify-manage'
    | '/question-types'
    | '/questions'
    | '/sections'
    | '/users'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | ''
    | '/login'
    | '/courses'
    | '/dify-manage'
    | '/question-types'
    | '/questions'
    | '/sections'
    | '/users'
  id:
    | '__root__'
    | '/'
    | '/_manage'
    | '/login'
    | '/_manage/courses/'
    | '/_manage/dify-manage/'
    | '/_manage/question-types/'
    | '/_manage/questions/'
    | '/_manage/sections/'
    | '/_manage/users/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ManageRoute: typeof ManageRouteWithChildren
  LoginRoute: typeof LoginRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ManageRoute: ManageRouteWithChildren,
  LoginRoute: LoginRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_manage",
        "/login"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_manage": {
      "filePath": "_manage.tsx",
      "children": [
        "/_manage/courses/",
        "/_manage/dify-manage/",
        "/_manage/question-types/",
        "/_manage/questions/",
        "/_manage/sections/",
        "/_manage/users/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_manage/courses/": {
      "filePath": "_manage/courses/index.tsx",
      "parent": "/_manage"
    },
    "/_manage/dify-manage/": {
      "filePath": "_manage/dify-manage/index.tsx",
      "parent": "/_manage"
    },
    "/_manage/question-types/": {
      "filePath": "_manage/question-types/index.tsx",
      "parent": "/_manage"
    },
    "/_manage/questions/": {
      "filePath": "_manage/questions/index.tsx",
      "parent": "/_manage"
    },
    "/_manage/sections/": {
      "filePath": "_manage/sections/index.tsx",
      "parent": "/_manage"
    },
    "/_manage/users/": {
      "filePath": "_manage/users/index.tsx",
      "parent": "/_manage"
    }
  }
}
ROUTE_MANIFEST_END */
