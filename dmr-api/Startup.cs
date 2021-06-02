using DMR_API.Data;
using DMR_API.Helpers;
using DMR_API.SignalrHub;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Microsoft.AspNetCore.CookiePolicy;
using DMR_API.Helpers.Extensions;
using dmr_api.Data;
using DMR_API.SchedulerHelper;
using Microsoft.AspNetCore.SpaServices.AngularCli;

namespace DMR_API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var appsettings = Configuration.GetSection("Appsettings").Get<Appsettings>();
            //Install repository and unitofwork
            services.AddScoped(typeof(IUnitOfWork), typeof(UnitOfWork));
            services.AddDatabaseExtention(Configuration)
                    .AddRepositoriesExtention()
                    .AddServicesExtention();
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = "localhost";
                options.InstanceName = "IoT";
            });
            services.AddSignalR();

            services.AddLogging();
          
            services.AddControllers()
                    .AddNewtonsoftJson(options =>
                                    {
                                        options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Unspecified;
                                        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                                    });
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.WithOrigins(appsettings.CorsPolicy
                    ) //register for client
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });
            services.AddTransient<DbInitializer>();
            //Auto Mapper
            services.AddAutoMapperExtention();

            services.AddAuthenticationWithSwaggerExtention(Configuration);

            services.AddHttpClientExtention(Configuration);

            services.AddShedulerExtention(Configuration);

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = @"wwwroot/ClientApp";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext dataContext)
        {

            dataContext.Database.Migrate();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Digital mixing room system");
            });
            app.UseCors("CorsPolicy");
            app.UseCors(x => x
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           //    .SetIsOriginAllowed(origin => true) // allow any origin
                           .AllowCredentials()); // allow credentials
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseDefaultFiles();
            app.UseStaticFiles();
           
            app.UseAuthentication()
               .UseCookiePolicy(new CookiePolicyOptions
               {
                    HttpOnly = HttpOnlyPolicy.Always
               });

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ECHub>("/ec-hub");

            });
            app.UseSpaStaticFiles();
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = @"wwwroot/ClientApp";
                //if (env.IsDevelopment())
                //{
                //    spa.Options.SourcePath = @"../dmr-app";
                //    spa.UseAngularCliServer(npmScript: "start");
                //}
            });

           
        }
    }
}
