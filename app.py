import streamlit as st

st.set_page_config(
    page_title="ELECTROHACK 4.0",
    page_icon="🚀"
)

st.title("🚀 ELECTROHACK 4.0")
st.write("Streamlit is working successfully!")

name = st.text_input("Enter your name")

if name:
    st.success(f"Hello, {name}! 👋")