"use client"

import { GetTodos } from '@/actions/todoAPis';
import Image from 'next/image';
import { createRef, useEffect, useState } from 'react';
import TodoItem from './todo-item';
import * as z from 'zod';


export interface TodoItemInterface {
    id: number | undefined;
    title: string;
    description?: string | undefined;
    completed: boolean | number;
    attachments?: Record<string, any>[];
    focused?: boolean;
    open?: boolean;
}

const notEmpty = z.string().trim().min(1, { message: "Please provide a title" });

export const formSchema = z.object({
    title: z.string().pipe(notEmpty),
    description: z.string().optional(),
    completed: z.boolean(),

});

export type formSchemaType = z.infer<typeof formSchema>



const Todo = () => {

    const { data: todos, isFetched, isLoading } = GetTodos()

    const [showInput, setShowInput] = useState(false)
    const lastRef = createRef<HTMLLIElement>();

    useEffect(() => {
        if (lastRef.current)
            lastRef?.current.scrollIntoView({ behavior: "smooth" });
    }, [lastRef]);




    const addItem = () => {
        setShowInput(true)

    };


    return (
        <div className="overflow-x-hidden  min-h-screen  bg-gray-800 flex items-center justify-center px-5 py-5">
            <div className="w-full mx-auto  rounded-lg border border-gray-700 p-8 lg:py-12 lg:px-14 text-gray-300 " style={{ maxWidth: '800px' }}>
                <div className="mb-10">
                    <h1 className="text-2xl font-bold">
                        Todos
                    </h1>
                </div>
                <div className="mb-10 ">
                    {isLoading ? <div className='h-full w-full flex justify-center items-center'>
                        <Image src="/icons/loading-svgrepo-com.svg" className='animate-spin' width={50} height={50} alt="Add" />
                    </div> :
                        isFetched && todos.data?.length ? (
                            <ul >
                                {todos?.data.map((item: TodoItemInterface, index: number) => {
                                    if (index === todos?.data?.length - 1) {
                                        return <li
                                            key={index}
                                            ref={lastRef}
                                        >
                                            <TodoItem
                                                item={item}
                                            />

                                        </li>
                                    }
                                    else {
                                        return <li
                                            key={index}
                                        >
                                            <TodoItem
                                                item={item}
                                            />

                                        </li>
                                    }
                                }
                                )}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No todos</p>
                        )}
                    {
                        showInput && <TodoItem
                            setShowInput={setShowInput}
                            item={{ id: undefined, title: '', completed: false, open: true }}
                        />
                    }
                </div>
                {
                    !isLoading &&
                    <div className="flex justify-center">
                        <button className="py-1 px-10 border border-gray-800 hover:border-gray-700 rounded leading-none focus:outline-none text-xl"
                            onClick={addItem}
                        >
                            <Image src="/icons/plus-svgrepo-com.svg" width={24} height={24} alt="Add" />
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Todo;
