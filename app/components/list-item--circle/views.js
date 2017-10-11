import React from "react"
import { Button } from "react-native-elements"
import { BACKGROUND_COLOR } from "../../constants"

// const Shadow = styled(BoxShadow)`
//     margin-bottom: 20px;
// `

const borderStyles = {
    borderColor: "white",
    borderRadius: 10,
    borderWidth: .3
}

export const ListItem = ({ children, color, icon, onPress, style, title }) => {
    return (
        <Button
            raised
            icon={ icon }
            buttonStyle={{ ...borderStyles, backgroundColor: BACKGROUND_COLOR }}
            containerViewStyle={{ ...style, ...borderStyles }}
            textStyle={{textAlign: 'center'}}
            title={ children || title }
            onPress={ onPress } />
    )
}
// export const ListItem = ({ children, color, icon, onPress }) => {
//     return (
//         <ListItemWithCircle onPress={ onPress }>
//             <Container>
//                 <StyledIcon name={ icon } />
//                 <Item
//                     name="people"
//                     color={ color }
//                     underlineColorAndroid="transparent">
//                     { children }
//                 </Item>
//             </Container>
//         </ListItemWithCircle>
//     )
// }