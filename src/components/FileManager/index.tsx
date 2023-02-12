import React, {FunctionComponent} from 'react'
import Tab from "../Tab/index"
import { ReactQueryDevtools } from 'react-query/devtools'

const Index:FunctionComponent = () => {
  return <div id='filemanager-container'>
    <Tab />
    {/* <ReactQueryDevtools /> */}
    </div>
}
 
export default Index;