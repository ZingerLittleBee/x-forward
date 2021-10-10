export default `{% for upstream in upstreams %}
upstream {{upstream['name']}} {
  {% if generateLoadBalancing(upstream) %}
  {{generateLoadBalancing(upstream)}}
  {% endif %}
  {% for server in upstream['server'] %}
  {{generateUpstreamServer(server)}}
  {% endfor %}
}
{% endfor %}

{% for server in servers %}
server {
  listen {{server['listen_port']}}{% if server['protocol'] -%}{{ server['protocol']}}{% endif -%};
  {% if server['proxy_next_upstream'] -%}proxy_next_upstream {{server['proxy_next_upstream']}};{%- endif %}
  {% if server['proxy_next_upstream_timeout'] -%}proxy_next_upstream_timeout {{server['proxy_next_upstream_timeout']}};{%- endif %}
  {% if server['proxy_next_upstream_tries'] -%}proxy_next_upstream_tries {{server['proxy_next_upstream_tries']}};{%- endif %}
  {% if server['proxy_connect_timeout'] -%}proxy_connect_timeout {{server['proxy_connect_timeout']}};{%- endif %}
  {% if server['proxy_upload_rate'] -%}proxy_upload_rate {{server['proxy_upload_rate']}};{%- endif %}
  {% if server['proxy_download_rate'] -%}proxy_download_rate {{server['proxy_download_rate']}};{%- endif %}
  {% if server['proxy_timeout'] -%}proxy_timeout {{server['proxy_timeout']}};{%- endif %}
  proxy_pass {{server['proxy_pass']}};
}
{% endfor %}`
