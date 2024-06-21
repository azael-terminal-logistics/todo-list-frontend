import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchWrapper } from '_helpers';

const name = 'tasks';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

export const taskActions = { ...slice.actions, ...extraActions };
export const taskReducer = slice.reducer;

function createInitialState() {
    return {
        list: null,
        item: null
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL}/tasks`;

    return {
        getAll: getAll(),
        getById: getById(),
        update: update(),
        register: register(),
        delete: _delete()
    };

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async ({currentPage,limitPerPage}) => {
                const response = await fetchWrapper.get(`${baseUrl}/?page=${currentPage}&limit=${limitPerPage}`);
                return response;
            }
        );
    }

    function getById() {
        return createAsyncThunk(
            `${name}/getById`,
            async (id) => await fetchWrapper.get(`${baseUrl}/${id}`)
        );
    }

    function register() {
        return createAsyncThunk(
            `${name}/register`,
            async (body) => await fetchWrapper.post(`${baseUrl}/`, body)
        );
    }

    function update() {
        return createAsyncThunk(
            `${name}/update`,
            async ({ id, data }) => {
                const { name, description, status } = data;
                const newData = {
                    name,
                    description,
                    status
                };
                await fetchWrapper.put(`${baseUrl}/${id}`, newData);
            }
        );
    }

    function _delete() {
        return createAsyncThunk(
            `${name}/delete`,
            async function (id) {
                console.log(id)
                await fetchWrapper.delete(`${baseUrl}/${id}`);
            }
        );
    }
}

function createExtraReducers() {
    return (builder) => {
        getAll();
        getById();
        _delete();

        function getAll() {
            var { pending, fulfilled, rejected } = extraActions.getAll;
            builder
                .addCase(pending, (state) => {
                    state.list = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.list = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.list = { error: action.error };
                });
        }

        function getById() {
            var { pending, fulfilled, rejected } = extraActions.getById;
            builder
                .addCase(pending, (state) => {
                    state.item = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.item = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.item = { error: action.error };
                });
        }

        function _delete() {
            var { pending, fulfilled, rejected } = extraActions.delete;
            builder
                .addCase(pending, (state, action) => {
                    const task = state.list.value.data.tasks.find(x => x.id === action.meta.arg);
                    task.isDeleting = true;
                })
                .addCase(fulfilled, (state, action) => {
                    state.list.value.data.tasks = state.list.value.data.tasks.filter(x => x.id !== action.meta.arg);
                })
                .addCase(rejected, (state, action) => {
                    const task = state.list.value.data.tasks.find(x => x.id === action.meta.arg);
                    task.isDeleting = false;
                });
        }
    }
}
