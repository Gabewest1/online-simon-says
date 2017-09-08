import React from "react"
import { shallow } from 'enzyme'
import { expect } from "chai"
import sinon from "sinon"
import SimonGame from "../app/components/simon__game"
import SimonPad from "../app/components/simon__pad"

describe('<SimonGame />', () => {
    it('should render', () => {
        const wrapper = shallow(<SimonGame />)
        expect(wrapper.instance()).to.equal(wrapper.instance())
    })

    it('should contain 4 <SimonPad /> components', () => {
        const wrapper = shallow(<SimonGame />)
        expect(wrapper.find(SimonPad)).to.have.length(4)
    })

    it('should pass down click events to <SimonPad /> components', () => {
        const onButtonClick = sinon.spy()
        const wrapper = shallow(<SimonGame onPress={ onButtonClick } />)
        wrapper.find(SimonPad).forEach(pad => pad.simulate('press'))
        expect(onButtonClick.callCount).to.equal(4)
    })
})
