<?php

return [

    'project' => [
        ['value' => 'todos', 'label' => 'Todos'],
        ['value' => 'waiting', 'label' => 'Aguardando aprovação'],
        ['value' => 'in_progress', 'label' => 'Projeto em andamento'],
        ['value' => 'cancelled', 'label' => 'Projeto cancelado'],
        ['value' => 'finished', 'label' => 'Projeto finalizado'],
    ],

    'projectClasses' => [
        'waiting' => 'bg-gray-500',
        'cancelled' => 'bg-red-400',
        'in_progress' => 'bg-teal-400',
        'finished' => 'bg-gray-500',
    ],

    'task' => [
        ['value' => 0, 'label' => 'Aberta'],
        ['value' => 1, 'label' => 'Aguardando aprovação'],
        ['value' => 2, 'label' => 'Finalizada'],
        ['value' => 3, 'label' => 'Em análise'],
    ],

    'taskClasses' => [
        ['value' => 0, 'label' => 'bg-gray-500'],
        ['value' => 1, 'label' => 'bg-red-400'],
        ['value' => 2, 'label' => 'bg-teal-400'],
        ['value' => 3, 'label' => 'bg-red-500'],
    ],

    'payment' => [
        ['value' => 0, 'label' => 'Todos'],
        ['value' => 1, 'label' => 'Pago'],
        ['value' => 2, 'label' => 'Parcialmente pago'],
    ],

];
