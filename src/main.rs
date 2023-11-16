use std::net::SocketAddr;
use askama::Template;
use axum::{Router, routing::{self, get_service}, response::{Response, IntoResponse, Html}, http::StatusCode};
use tower_http::services::ServeDir;

#[derive(Debug, Clone)]
struct Phase {
    id: u32,
    name: String,
    duration: u16
}

#[derive(Debug)]
struct Scenario {
    id: u32,
    name: String,
    phases: Vec<Phase>
}

fn get_phases() -> Vec<Phase> {
    vec![
        Phase {
        id: 1,
        name: "Takeoff".into(),
        duration: 30
        },
        Phase {
        id: 2,
        name: "Climbout".into(),
        duration: 30
        },
        Phase {
        id: 3,
        name: "Downwind".into(),
        duration: 20
        },
        Phase {
        id: 4,
        name: "Approach".into(),
        duration: 30
        },
        Phase {
        id: 5,
        name: "Landing".into(),
        duration: 30
        }
    ]
}

fn get_scenarios() -> Vec<Scenario>{
    let phases = get_phases();

    vec![
    Scenario {
        id: 1,
        name: "Takeoff".into(),
        phases: phases.iter().filter(|phase| phase.id == 1 || phase.id == 2).cloned().collect()
        },
        Scenario {
        id: 2,
        name: "Climbout".into(),
        phases: phases.iter().filter(|phase| phase.id == 2).cloned().collect()
        },
        Scenario {
        id: 3,
        name: String::from("Landing"),
        phases: phases.iter().filter(|phase| phase.id == 4 || phase.id == 5).cloned().collect()
        }
    ]
}


#[tokio::main]
async fn main() {
    let addr = SocketAddr::from(([0,0,0,0], 3500));
    let app = Router::new().route("/", routing::get(index)).fallback_service(routes_javascript()).layer(tower_livereload::LiveReloadLayer::new());

    println!("Listening on {addr}...");
    axum::Server::bind(&addr).serve(app.into_make_service()).await.expect("Failed to start server");
}

fn routes_javascript() -> Router {
    Router::new().nest_service("/", get_service(ServeDir::new("./javascript/")))
}

async fn index() -> impl IntoResponse {
    let scenarios = get_scenarios();

    let template = IndexTemplate { scenarios };
    HtmlTemplate(template)
}

#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate {
    scenarios: Vec<Scenario>
}

struct HtmlTemplate<T>(T);

impl<T> IntoResponse for HtmlTemplate<T>
where
    T: Template,
{
    fn into_response(self) -> Response {
        match self.0.render() {
            Ok(html) => Html(html).into_response(),
            Err(err) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to render template. Error: {err}"),
            )
                .into_response(),
        }
    }
}
