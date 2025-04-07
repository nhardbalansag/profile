const setItem = async (accessor, item) =>{
    return await localStorage.setItem(accessor, item);
}

const getItem = async (accessor) =>{
    return await localStorage.getItem(accessor);
}

const removeItem = async (accessor) =>{
    return await localStorage.removeItem(accessor);
}

const clear = async() =>{
    return await localStorage.clear();
}

export {
    setItem,
    getItem,
    removeItem,
    clear
}