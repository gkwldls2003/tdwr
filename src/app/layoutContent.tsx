import Header from "@/layout/header/page";
import LeftSider from "@/layout/sider/page";
import { useSelector } from "react-redux";
import { selectShowLeftSider } from "../../store/layoutSlice";
import Footer from "@/layout/footer/page";
import './style.css';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const showLeftSider = useSelector(selectShowLeftSider);
  
    return (
      <div id="main-content">
        <Header/>
        <div id="contents_wrap">
          {showLeftSider && <LeftSider/>}
          <div className="flex-1 relative">
            {children}
          </div>
        </div>
        <Footer/>
      </div>
    );
  }