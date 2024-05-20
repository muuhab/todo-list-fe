"use client";

import { BASE_URL } from '@/config/datasource';
import Image from 'next/image';
import { FC } from 'react';
import { TodoItemInterface as TodoType } from './todo';
import { useTodoItem } from '@/hooks/use-todo-item';

interface TodoItemProps {
    item: TodoType;
    setShowInput?: (value: boolean) => void;
}

const TodoItem: FC<TodoItemProps> = ({ item, setShowInput }) => {

    const {
        form,
        focus,
        open,
        handleBlur,
        focusItem,
        openItem,
        removeItem,
        onFileChange,
    } = useTodoItem(item, setShowInput)

    return <form
        tabIndex={0}
        onBlur={handleBlur}
        onClick={(e) => { e.stopPropagation(); focusItem(); }}
        onDoubleClick={() => openItem()}
        className={`px-2 py-4 rounded transition-all flex text-md bg-gray-700 ${focus && 'bg-indigo-800'} shadow-lg  my-10 -mx-2 ${!open && 'mb-1 cursor-pointer px-4 '}`}
    >
        <div className="flex-none w-10 leading-none">
            <input type="checkbox"
                {...form.register('completed')}
            />
        </div>
        <div className="flex-grow max-w-full">
            <div className="w-full leading-none">
                <h3 className={`text-md leading-none truncate w-full pr-10 ${item.title?.length ? 'text-gray-300' : 'text-gray-500'}`} style={{ display: open ? 'none' : 'block' }}>
                    {form.getValues('title') || 'New todo...'}
                </h3>
                <input
                    type="text"
                    style={{ display: open ? 'block' : 'none' }}
                    className="text-md w-full bg-transparent text-gray-300 leading-none focus:outline-none mb-2"
                    placeholder="New todo..."
                    {...form.register('title')}
                />
            </div>
            <div className="w-full" style={{ display: open ? 'block' : 'none' }}>
                <textarea
                    className="text-md w-full bg-transparent text-gray-300 leading-tight focus:outline-none"
                    {...form.register('description')}
                    placeholder="Notes"
                />
            </div>
            <div style={{ display: open ? 'flex' : 'none' }} className='flex gap-2  py-4'>
                {
                    item?.attachments?.map((attachment, index) => {
                        return <div key={index} className="flex flex-col  items-start cursor-pointer">
                            <Image src="/icons/pdf-svgrepo-com.svg" onClick={() => {
                                window.open(`${BASE_URL}/${attachment?.path}`)
                            }} width={30} height={30} alt="pdf" />
                            <p className='text-xs'>{attachment?.name}</p>
                        </div>
                    }
                    )
                }
            </div>
            <div className="flex  justify-end items-center gap-8 ">

                <div style={{ display: open ? 'flex' : 'none' }}>

                    <input
                        type="file" onChange={onFileChange}
                        accept="application/pdf"
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="multiple_files" multiple />
                </div>
                {
                    item.id &&

                    <div className=" flex justify-end" style={{ display: open ? 'flex' : 'none' }}>
                        <button className="p-1 mr-4 focus:outline-none hover:text-red-300"
                            type='button'
                            onClick={removeItem}
                        >
                            <Image src="/icons/trash-bin-2-svgrepo-com.svg" width={20} height={20} alt="Add" />
                        </button>
                    </div>
                }
            </div>
        </div>
    </form>

}

export default TodoItem