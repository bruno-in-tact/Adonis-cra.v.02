/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Route.resource('/users', 'UserController')


Route.group(() => { 

    Route.group(() => {
        Route.post('/new', 'UserController.new') 
        Route.post('/login', 'SecurityController.login')
        Route.post('/passlost/token', 'SecurityController.passLostGenerateToken')
        Route.put('/passlost/password', 'SecurityController.passlostUpdate')
    }).prefix('/users')
    
    Route.group(()=> {    
        Route.get('/logout', 'SecurityController.logout')
        Route.get('/me', 'UserController.me')
        Route.get('/index', 'UserController.index').middleware("auth").middleware('admin');
        Route.get('/get', 'UserController.getAllNotDeleted').middleware('admin');
        Route.get('/:id', 'UserController.find').middleware('admin');
        Route.put('/update/:id', 'UserController.update').middleware('admin');
        Route.put('/setAdmin/:id', 'UserController.setToAdmin').middleware('admin');
        Route.delete('/soft-delete/:id', 'UserController.softDelete').middleware('admin');
        Route.delete('/delete/:id', 'UserController.destroy').middleware('admin');
      }).prefix('/users').middleware(['auth'])
    // }).prefix('/users')



    Route.group(() => {
        Route.post('/new', 'ProjectController.new')
        Route.get('/index', 'ProjectController.getAllProjectsEvenDeleted').middleware('admin')
        Route.get('/get', 'ProjectController.getAllNotDeleted').middleware('admin')
        Route.get('/:id', 'ProjectController.find').middleware('admin')
        Route.put('/update/:id', 'ProjectController.update').middleware('admin')
        Route.delete('/soft-delete/:id', 'ProjectController.softDelete').middleware('admin')
        Route.delete('/delete/:id', 'ProjectController.destroy').middleware('admin')
    }).prefix('/projects').middleware(['auth'])


    Route.group(() => {
        Route.post('/new', 'PlanningController.new')
        Route.get('/index', 'PlanningController.index').middleware('admin')
        Route.get('/get', 'PlanningController.getAllNotDeleted').middleware('admin')
        Route.get('/:id', 'PlanningController.find').middleware('admin')
        Route.put('/update/:id', 'PlanningController.update').middleware('admin')
        Route.delete('/soft-delete/:id', 'PlanningController.softDelete').middleware('admin')
        Route.delete('/delete/:id', 'PlanningController.destroy').middleware('admin')
    }).prefix('/plannings').middleware(['auth'])


    Route.group(() => {
        Route.post('/new', 'UserProjectsController.new')
        Route.get('/index', 'UserProjectsController.getAllUserProjects').middleware('admin')
        Route.get('/me', 'UserProjectsController.me')
        Route.get('/find', 'UserProjectsController.find').middleware('admin')
        Route.put('/update/:id', 'UserProjectsController.update').middleware('admin')
        Route.delete('/soft-delete', 'UserProjectsController.softDelete').middleware('admin')
        Route.delete('/delete', 'UserProjectsController.destroy').middleware('admin')

    }).prefix('/usersProjects').middleware(['auth'])

}).prefix('/api')
