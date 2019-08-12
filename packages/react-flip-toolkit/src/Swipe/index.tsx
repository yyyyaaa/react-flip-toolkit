import React, { Component, cloneElement } from 'react'
import { GestureContext, GestureContextProps } from '../Flipper'
import PropTypes from 'prop-types'
import Swipe from '../FlipToolkit/Swipe'
import { SwipeProps } from '../FlipToolkit/Swipe/types'

const configProps = PropTypes.oneOfType([
  PropTypes.shape({
    initFlip: PropTypes.func,
    cancelFlip: PropTypes.func,
    threshold: PropTypes.number
  }),
  PropTypes.bool
])

const swipePropTypes = {
  children: PropTypes.node.isRequired,
  flipId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  touchOnly: PropTypes.bool,
  onClick: PropTypes.func,
  onUp: PropTypes.func,
  onDown: PropTypes.func,
  threshold: PropTypes.number,
  right: configProps,
  left: configProps,
  top: configProps,
  bottom: configProps
}

type SwipeComponentProps = SwipeProps & {
  children: React.ReactElement
}

class SwipeComponent extends Component<SwipeComponentProps> {
  static propTypes = swipePropTypes

  processProps = (props: SwipeComponentProps) => {
    return {
      ...props,
      flipId: props.flipId
        ? String(props.flipId)
        : String(props.children.props.flipId)
    }
  }

  componentDidUpdate(prevProps: SwipeComponentProps) {
    this.swipe.props = this.processProps(this.props)
    this.swipe.prevProps = this.processProps(prevProps)
  }

  swipe = new Swipe(this.processProps(this.props))

  render() {
    React.Children.only(this.props.children)
    // @ts-ignore
    if (this.props.children.type.displayName === 'Flipped') {
      return cloneElement(this.props.children, {
        gestureHandlers: this.swipe.handlers
      })
    }
    return cloneElement(this.props.children, this.swipe.handlers)
  }
}

export default function SwipeWrapper(props: SwipeComponentProps) {
  return (
    <GestureContext.Consumer>
      {({
        inProgressAnimations,
        setIsGestureInitiated
      }: GestureContextProps) => {
        console.log({ inProgressAnimations, setIsGestureInitiated })
        return (
          <SwipeComponent
            inProgressAnimations={inProgressAnimations}
            setIsGestureInitiated={setIsGestureInitiated}
            {...props}
          />
        )
      }}
    </GestureContext.Consumer>
  )
}

SwipeWrapper.propTypes = swipePropTypes
