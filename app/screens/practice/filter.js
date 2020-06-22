<View
  style={{
    height: SCREEN_HEIGHT * 0.6,
    backgroundColor: "#fff",
    width: SCREEN_WIDTH,
  }}
>
  <Provider>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        backgroundColor: "#fff",
        width: SCREEN_WIDTH,
      }}
    >
      <Menu
        style={{
          marginTop: -30,
          zIndex: 100,
        }}
        visible={visible}
        onDismiss={_closeMenu}
        anchor={<Button onPress={_openMenu}>Filter</Button>}
      >
        <Menu.Item onPress={filterAudio} title="Only Audio" />
        <Menu.Item onPress={filterVideo} title="Only Video" />
        <Divider style={{ backgroundColor: "#000" }} />
        <Menu.Item onPress={filterComplexityHard} title="Hard" />
        <Menu.Item onPress={filterComplexityMedium} title="Medium" />
        <Menu.Item onPress={filterComplexityEasy} title="Easy" />
        <Divider style={{ backgroundColor: "#000" }} />
        <Menu.Item onPress={filterVisited} title="Visited" />
        <Menu.Item onPress={filterNone} title="All" />
      </Menu>
    </View>
  </Provider>
</View>;
