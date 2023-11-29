import React, { Component } from 'react'
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';

type Props = React.ComponentProps<typeof TextInput> & {
  label: string,
  onRef?: Function,
  keyboardDone?: string,
  errorText?: string | null
}

class AnimatedInput extends Component<Props> {
    label;
    value;
    style;
    onBlur;
    onFocus;
    inputRef;
    focusAnim;
    restOfProps;
    constructor(props: Props) {
        super(props);
        const {
            label,
            errorText,
            style,
            onBlur,
            onFocus,
            onRef,
            keyboardDone,
            ...restOfProps
        } = props;
        this.label = label;
        this.style = style;
        this.restOfProps = restOfProps;
        this.inputRef = React.createRef();
        this.focusAnim = React.createRef();
        this.focusAnim.current = new Animated.Value(0);
        this.focusAnim = this.focusAnim.current;
    }
    state = {
        isFocused: false
    };

  componentDidUpdate = (prevProps) =>  {
    if (
        this.focusAnim !== prevProps.focusAnim ||
        this.state.isFocused !== prevProps.isFocused ||
        this.value !== prevProps.value
      ) {
        Animated.timing(this.focusAnim, {
            toValue: this.state.isFocused || !!this.value ? 1 : 0,
            duration: 150,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }).start()
      } 
  }
  render(): React.ReactNode {
      let color = this.state.isFocused ? '#080F9C' : '#B9C4CA'
      if (this.props.errorText) {
          color = '#B00020'
      }
      return (
          <View style={this.style}>
              <ScrollView
              >
                  <TextInput
                      returnKeyType={this.props.keyboardDone ? 'done' : 'next'}
                      style={[
                          styles.input,
                          {
                              borderColor: color,
                          },
                      ]}
                      ref={(r)=> {
                        this.inputRef = r;
                        if(this.props.onRef)
                            this.props.onRef(r);
                      }}
                      {...this.restOfProps}
                      onEndEditing={(e) => {
                        if(e.nativeEvent.text === "")
                            this.setState({ isFocused: false });
                      }}
                      onBlur={(event) => {
                          this.onBlur?.(event)
                      }}
                      onFocus={(event) => {
                        this.setState({isFocused:true})
                        this.onFocus?.(event)
                      }}
                  />
                  <TouchableWithoutFeedback onPress={() => this.inputRef.current?.focus()}>
                      <Animated.View
                          style={[
                              styles.labelContainer,
                              {
                                  transform: [
                                      {
                                          scale: this.focusAnim.interpolate({
                                              inputRange: [0, 1],
                                              outputRange: [1, 0.75],
                                          }),
                                      },
                                      {
                                          translateY: this.focusAnim.interpolate({
                                              inputRange: [0, 1],
                                              outputRange: [24, -12],
                                          }),
                                      },
                                      {
                                          translateX: this.focusAnim.interpolate({
                                              inputRange: [0, 1],
                                              outputRange: [16, 0],
                                          }),
                                      },
                                  ],
                              },
                          ]}
                      >
                          <Text
                              style={[
                                  styles.label,
                                  {
                                      color,
                                  },
                              ]}
                          >
                              {this.label}
                              {this.props.errorText ? '*' : ''}
                          </Text>
                      </Animated.View>
                  </TouchableWithoutFeedback>
                  {!!this.props.errorText && <Text style={styles.error}>{this.props.errorText}</Text>}
              </ScrollView>
          </View>
      )
  }
}

const styles = StyleSheet.create({
  input: {
    padding: 24,
    borderWidth: 1,
    width: Dimensions.get('window').width / 1.25,
    borderRadius: 4,
    fontSize: 16,
  },
  labelContainer: {
    position: 'absolute',
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
    color: '#B00020',
  },
})

export default AnimatedInput;