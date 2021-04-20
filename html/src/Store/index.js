import React from 'react';

const StoreContext = React.createContext()

const Store = (props) =>{
    return (
        <StoreContext.Provider value={{store:{name:"DataStore"}}} >
            {props.children}
        </StoreContext.Provider>
    )
}

export { StoreContext, Store }